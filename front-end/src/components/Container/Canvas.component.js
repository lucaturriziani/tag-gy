import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Component } from "react";
import { getAllTag } from "../../service/db.service";
import * as ImgService from "../../service/img.service";
import { brightColorRandom } from "../../utils/color";
import { App } from "../App";
import { GroupButtonsFooter } from "./Footer/GroupButtonsFooter.component";
import { TagVisualizer } from "./Header/TagVisualizer.component";
import { Button } from 'primereact/button';
import './ContainerImgTagging.style.css';
import { fabric } from 'fabric';
import { urlMongo } from "../../environments/environment";

const offsetTag = 0;
export class CanvasFabric extends Component {

    constructor(props) {
        super(props);

        this.state = {
            images: null,
            selectedTag: null,
            downloaded: false,
            availTag: [],
        }

        // riferimenti al canvas e ai suoi oggetti
        this.activeRect = null;
        this.activeTag = null;
        this.canvas = null;
        this.canvasWdt = null;
        this.canvasHgt = null;
    }

    /**
     * Quando il componente viene caricato la prima volta vengono effettuate le seguenti operazioni:
     * - recupero dei tag presenti nel db a cui ad ognuno di essi viene assegnato un colore;
     * - recupero delle immagini e dei tag creati su di essa;
     * - caricamento del canvas con la prima immagine e visualizzazione dei tag presenti per qull'immagine;
     * @see loadCanvas
     */
    componentDidMount() {
        window.$currentTag = []

        getAllTag("/img").then(res => {
            console.log("response tags", res.data)
            let distTag = res.data;
            distTag = distTag.map(item => {
                let tag = {
                    name: item,
                    color: brightColorRandom()
                }
                return tag;
            });
            this.setState({ availTag: distTag }, () => {
                ImgService.get().then(res => {
                    const imgs = res.data;
                    if (imgs.length) {
                        console.log("response", res.data);
                        this.setState({ images: imgs });
                        this.setState({ downloaded: true }, () => {
                            this.loadCanvas();

                            fabric.Object.prototype.transparentCorners = false;
                            fabric.Object.prototype.hasBorders = false;
                            fabric.Object.prototype.setControlVisible('mtr', false)
                        });
                    };
                })
            })
        }).catch(err => {
            console.log("error while retriving available tags", err);
            App.visualizeToast("error", "Error", err.toString());
        })
    }

    /**
     * Funzione per la creazione dell'oggetto Canvas della libreria fabric.js
     * Il canvas prenderà le dimensioni a seconda delle dimensioni del container nello schermo dell'utente
     * Verranno impostate anche le funzioni di handler per gli eventi del mouse
     * @see mouseDown
     * @see mouseMove
     * @see mouseUp
     * Infine verrà caricata l'immagine corrente con i relativi tag
     * @see loadImg
     */
    loadCanvas(){
        // dimensioni del canvas
        this.canvasWdt = document.getElementById('cnvs-container').clientWidth
        this.canvasHgt = this.canvasWdt * 70 / 100;
        this.canvas = new fabric.Canvas('c', {
            selection: false,
            width: this.canvasWdt,
            height: this.canvasHgt,
        });

        // mouse event handler
        this.canvas.on({
            'mouse:down': (e) => this.mouseDown(e),
            'mouse:move': (e) => this.mouseMove(e),
            'mouse:up': (e) => this.mouseUp(e)
        });

        this.loadImg(this.canvasWdt, this.canvasHgt)
    }

    /**
     * Imposta l'immagine corrente come background del canvas: l'immagine viene recuperata dal server passando
     * le dimensioni del canvas.
     * Una volta caricata l'immagine, creo un rettangolo per ogni tag associato all'immagine a seconda dei quattro angoli.
     * Ad ogni rettangolo vengono settate le funzioni di handler per gli eventi di modifica.
     * @see modifyingRect evento richiamato quando il rettangolo è in modifica
     * @see modifiedRect evento richiamato quando il rettangolo termina le modifiche
     * Infine viene aggiunto il nome del tag all'angolo in alto a destra creando un rettangolo separato per esso.
     * @param {*} canvasWdt larghezza del canvas
     * @param {*} canvasHgt altezza del canvas
     */
    loadImg(canvasWdt, canvasHgt) {
        // recupero dal server l'immagine iniziale con le dimensioni pari a quelle del canvas e inserisco vecchi tag
        this.canvas.setBackgroundImage(urlMongo + "/img/file/" + this.state.images[this.props.count]._id + "?width=" + canvasWdt + "&height=" + canvasHgt, () => {
            this.canvas.renderAndReset();
            this.state.images[this.props.count].spans.forEach(item => {
                let spanTag = this.state.availTag.find(tag => { return tag.name === item.label })
                let colorBackground = spanTag.color.replace(')', ', 0.3)');
                let rect = new fabric.Rect({
                    left: item.x,
                    top: item.y,
                    width: item.w,
                    height: item.h,
                    aCoords: item.coords,
                    fill: 'rgba(255,255,255,0.0)',
                    stroke: spanTag.color,
                    strokeWidth: 6,
                    strokeUniform: true,
                    selectable: false,
                    name: spanTag.name,
                    hoverCursor: 'default',
                    dirty: false,
                    objectCaching: false,
                    selectionBackgroundColor: colorBackground,
                    data: item._id
                });
                // handler per quando il rettangolo si sta muovendo, ridimensionando o quando ha termitato queste due operazioni
                rect.on({
                    'moving': (e) => this.modifyingRect(e),
                    'scaling': (e) => this.modifyingRect(e),
                    'moved': (e) => this.modifiedRect(e),
                    'scaled': (e) => this.modifiedRect(e)
                });
                rect.borderColor = spanTag.color;
                rect.cornerColor = spanTag.color;
                this.canvas.add(rect);
                this.createTagName(rect);
                this.canvas.renderAndReset();
            })
        })
    }

    modifyingRect = (e) => {
        // durante le modifiche il contenitore del tag diventa invisibile
        this.activeTag.visible = false;
    }

    /**
     * Quando il rettangolo termina le modifiche di ridimensionamento bisogna spostare anche il 
     * rettangolo contenitore del tag associato.
     * Vengono recuperate le nuove coordinate del rettangolo a cui si sono apportate modifiche.
     * @see getXY 
     * Si recupera l'oggetto contenitore del nome del tag associato, si rimuove dal canvas 
     * e si riaggiunge con le coordinate modificate.
     * @param {*} e contiene le informazioni del rettangolo a cui si hanno apportato modifiche
     */
    modifiedRect = (e) => {
        // ottengo le nuove cordinate del rettangolo
        const [x, y] = this.getXY(e.target)

        // recupero l'oggetto contenitore del tag
        const tagRect = this.canvas.getObjects().find((item) => {
            // scarto tutti gli elemeni che non sono contenitori di tag
            if (item.data !== "TAGNAME") return null;
            // confronto le coordinate con il contenitore di tag attivo
            if (this.activeTag.left === item.left && this.activeTag.top === item.top) return item;
            return null;
        })
        this.canvas.remove(tagRect);
        // imposto le nuove coordinate, lo rendo visibile e riaggiungo l'elemento modificato al canvas
        this.activeTag.left = x + offsetTag;
        this.activeTag.top = y + offsetTag;
        this.activeTag.visible = true;
        this.canvas.add(this.activeTag);
    }

    /**
     * Se il mouse effettua il click in una zona vuota consente di iniziare la procedura di creazione 
     * di un nuovo rettangolo, altrimenti se interrompe si ha cliccato su un contenitore di tag o 
     * non si ha selezionato un tag con cui iniziare la procedura di tagging 
     * @param {*} e contiene le informazioni del canvas nel punto in cui si ha cliccato, se si clicca 
     * sopra un oggetto si ha anche il riferimento ad esso
     */
    mouseDown = (e) => {
        if (e.target !== null && e.target.data === "TAGNAME") return;
        // se nessun tag è stato selezionato blocco tutto e stampo a video il messaggio di errore
        if (this.state.selectedTag === null) {
            App.visualizeToast("error", "Error", "Please select or insert a tag");
            return;
        }
        // se ho selezionato qualcosa blocco la creazione del rettangolo, corrisponde alla XOR
        if (this.canvas.getActiveObject() !== undefined ? (this.canvas.getActiveObject() !== null) : (this.canvas.getActiveObject() === null)) return;
        // calcolo il colore di background per quando il rettangolo verrà selezionato, aggiungo trasparenza ad esso
        let colorBackground = this.state.selectedTag.color
        colorBackground = colorBackground.replace(')', ', 0.3)');
        this.activeRect = this.createRect(e.pointer.x, e.pointer.y, 0, 0, this.state.selectedTag, colorBackground)
        this.activeRect.hasControls = false;
        this.canvas.add(this.activeRect);
        this.canvas.setActiveObject(this.activeRect);
    }

    /**
     * Se non si ha nessun rettangolo in fase di creazione si interrompe altrimenti si aggiornano le coordinate
     * @param {*} e contiene le informazioni del canvas nel punto in cui si sta muovendo il mouse
     */
    mouseMove = (e) => {
        // se non ho nessun rettangolo attivo significa che non sono in fase di creazione
        if (this.activeRect === null) return;
        // aggiorno la lunghezza e l'altezza del rettangolo
        this.activeRect.width = e.pointer.x - this.activeRect.left;
        this.activeRect.height = e.pointer.y - this.activeRect.top;
        // aggiorno il canvas
        this.canvas.renderAll()
    }

    /**
     * Si recupera l'oggetto attivo e se è un rettangolo in fase di creazione si controlla che abbia 
     * spessore (in altezza o in larghezza), in caso negativo si rimuove l'oggetto e non si salvano le 
     * proprietà. Se il rettangolo ha proprietà corrette allora si procede a creare il contenitore di tag
     * associato.
     * @see createTagName
     * @param {*} e contiene le informazioni del canvas nel punto in cui si alza il mouse
     */
    mouseUp = (e) => {
        // se non ho selezionato il tag interrompo, il messaggio viene visualizzato in mouseDown
        if (this.state.selectedTag === null) return;
        // recupero l'elemento attivo
        let rect = this.canvas.getActiveObject();
        // se l'elemento è vecchio interrompo
        if (rect.data === "old") return;
        // controllo che l'elemento abbia spessore, in caso positivo lo elimino dal canvas
        if (rect.width === 0 || (rect.height === undefined || rect.height === 0)) {
            this.canvas.remove(rect);
            this.canvas.renderAll();
            return;
        }
        this.activeRect.hasControls = true;
        // tolgo la selezione all'oggetto e aggiorno il canvas 
        this.canvas.discardActiveObject();
        this.activeRect = null;
        this.canvas.renderAll();
        //creo il contenitore di tag
        this.createTagName(rect);
    }

    /**
     * Crea un nuovo rettangolo impostando varie proprietà e associando le funzioni di handler per le modifiche
     * @see modifiedRect
     * @see modifyingRect
     * @param {*} x 
     * @param {*} y 
     * @param {*} width 
     * @param {*} height 
     * @param {*} spanTag informazioni del tag con cui si sta creando il rettangolo
     * @param {*} colorBackground colore di background quando l'oggetto è selezionato
     */
    createRect(x, y, width, height, spanTag, colorBackground) {
        let newRect = new fabric.Rect({
            left: x,
            top: y,
            fill: 'rgba(255,255,255,0.0)',
            width: width,
            length: height,
            stroke: spanTag.color,
            strokeWidth: 6,
            strokeUniform: true,
            selectable: false,
            name: spanTag.name,
            hoverCursor: 'default',
            dirty: false,
            objectCaching: false,
            selectionBackgroundColor: colorBackground
        });
        // handler per quando il rettangolo si sta muovendo, ridimensionando o quando ha termitato queste due operazioni
        newRect.on({
            'moving': (e) => this.modifyingRect(e),
            'scaling': (e) => this.modifyingRect(e),
            'moved': (e) => this.modifiedRect(e),
            'scaled': (e) => this.modifiedRect(e)
        });
        newRect.borderColor = spanTag.color;
        newRect.cornerColor = spanTag.color;
        return newRect;
    }

    /**
     * Recupera le coordinate corrette del rettangolo e crea un contenitore associato
     * Si imposta anche la funzione di handler nel caso in cui si clicchi sopra di esso.
     * Se si clicca sopra il contenitore si recupera il rettangolo associato, lo si setta come oggetto attivo
     *  e si setta un metadato per riconoscere che il rettangolo era già stato inserito nel canvas e che si 
     * deve procedere alla modifica di esso 
     * @see getXY
     * @param {*} rect il rettangolo a cui si vuole associare il contenitore di tag
     */
    createTagName(rect) {
        let [x, y] = this.getXY(rect);
        let tagName = new fabric.Textbox(rect.name, {
            left: x + offsetTag,
            top: y + offsetTag,
            backgroundColor: rect.stroke,
            hoverCursor: 'pointer',
            selectable: false,
            fontSize: 16,
            fontFamily: 'Arial',
            charSpacing: 1,
            textAlign: 'right',
            data: "TAGNAME",
            hasBorders: false,
            hasControls: false,
        })
        this.canvas.add(tagName);
        // handle del click sul contenitore di tag
        tagName.on('mousedown', (e) => {
            // recupero le informazioni del contenitore di tag
            const trg = e.target;
            // imposto il contenitore di tag come attivo 
            this.activeTag = trg;
            // recupero il rettangolo corrispondente confrontando le coordinate
            let rect = this.canvas.getObjects().find((item) => {
                // scarto tutti gli elementi contenitori di tag
                if (item.data === "TAGNAME") return null;
                let [x, y] = this.getXY(item);
                if (trg.left - offsetTag === x && trg.top - offsetTag === y) return item;
                return null;
            })
            // setto informazione in modo da sapere che il rettangolo è vecchio e non è in fase di creazione
            rect.data = "old";
            // imposto l'elemento come attivo
            this.canvas.setActiveObject(rect);
        })
    }

    /**
     * A seconda dell'oggetto attivo si procede a recuperare il contenitore associato e si rimouvono 
     * entrambi gli oggetti dal canvas
     * @see getXY
     */
    startDelete = () => {
        // se non ho nessun rettangolo selezionato annullo
        if (this.canvas.getActiveObject() === null) return;
        // recupero il rettangolo attivo
        const rect = this.canvas.getActiveObject();
        // cerco il tag relativo 
        const tagRect = this.canvas.getObjects().find((item) => {
            // scarto tutti gli elementi che non sono tag
            if (item.data !== "TAGNAME") return null;
            // recupero le coordinate dell'angolo top-left del rettangolo attivo 
            let [x, y] = this.getXY(rect);
            // confronte le coordinate
            if (item.left === x - offsetTag && item.top === y - offsetTag) return item;
            return null;
        })
        // rimuovo entrambi gli oggetti e deseleziono l'oggetto attivo
        this.canvas.remove(tagRect)
        this.canvas.remove(rect)
        this.canvas.discardActiveObject();

    }

    startDeleteAll = () => {
        this.canvas.getObjects().forEach(item => {
            this.canvas.remove(item);
        })
    }

    /**
     * Si controlla se la lunghezza o l'altezza scalate siano maggiori di 0, in caso affermativo 
     * si restituiscono semplicemente la x e la y con sommata ed esse un valore identificativo che dovrebbe
     * corrispondere alla larghezza dello stroke del rettangolo. In caso negativo si sommano la x e la y con la 
     * larghezza e l'altezza dell'oggetto rispettivamente e si sottrae uno ad entrambe sempre a causa dello stroke
     * @param {*} item oggetto da cui recuperare le coordinate dell'angolo top-left
     */
    getXY(item) {
        // recupero coordinate in modo da avere sempre quelle dell'angolo in alto a sinistra
        let x = item.getScaledWidth() > 0 ? item.left + 5 : item.left + item.getScaledWidth() - 1;
        let y = item.getScaledHeight() > 0 ? item.top + 5 : item.top + item.getScaledHeight() - 1;
        return [x, y]
    }

    /**
     * Richiamata al click sul pulsante di salvataggio del tagging effettuato sull'immagine
     * Procede ad effettuare il salvataggio sul db dei tag presenti nel canvas creando oggetti
     * con proprietà specifiche per il db.
     * Una volta effettuato il salvataggio si passa il valore di incremento alla sidebar
     * @see accept in Home.component
     */
    acceptSentences = () => {
        if (this.props.count < this.state.images.length) {
            let list = this.state.images;
            list[this.props.count].spans = [];
            this.canvas.getObjects().forEach(item => {
                if (item.data !== 'TAGNAME') {
                    list[this.props.count].spans.push({
                        x: item.left,
                        y: item.top,
                        w: item.getScaledWidth(),
                        h: item.getScaledHeight(),
                        coords: item.aCoords,
                        label: item.name
                    })
                }
            })
            this.setState({ images: list });
            ImgService.put(this.state.images[this.props.count]).then(res => {
                this.props.accept(100 / this.state.images.length);
            }).catch(err => {
                console.log("update", err)
            })
        } else {
            App.visualizeToast('warn', 'Warning', "No more elements are present")
        }
    }

    /**
     * Richiamata al click sul pulsante di skip, passa alla sidebar il valore d'incremento
     * @see ignore in Home.component
     */
    ignoreSentences = () => {
        if (this.props.count < this.state.images.length) {
            this.props.ignore(100 / this.state.images.length);
        } else {
            App.visualizeToast('warn', 'Warning', "No more elements are present")
        }
    }

    /**
     * Richiamata da Home.component dopo aver incrementato il valore del count, consente di passare
     * al tagging dell'immagine successiva
     * @see loadImg 
     */
    nextImages() {
        if (this.state.images[this.props.count] !== undefined) {
            this.startDeleteAll();
            this.loadImg(this.canvasWdt, this.canvasHgt)
        }
    }

    /**
     * Richiamata da Home.component dopo aver decrementato il valore del count, consente di passare
     * al tagging dell'immagine precedente
     * @see loadImg
     */
    previous() {
        if(this.props.count === this.state.images.length - 1) this.loadCanvas()
        this.startDeleteAll();
        this.loadImg(this.canvasWdt, this.canvasHgt)
    }

    /**
     * Richiamata al click sul pulsante back, passa il valore di decremento alla sidebar
     * @see back
     */
    previousSentences = () => {
        if (this.props.count !== 0) {
            this.props.back(100 / this.state.images.length);
        }
    }

    /**
     * Al tag selezionato viene impostato il colore di background per far visualizzare all'utente
     * il colore con cui si procederà ad effettuare l'operazione di tagging
     * @param {*} tag riferimento al tag su cui si ha cliccato nel TagVisualizer.component
     */
    onTagSelected = (tag) => {
        if (tag === null || tag === undefined) return;
        console.log("selectTAG", this.state.selectedTag)
        if (tag !== this.state.selectedTag) {
            if (this.state.selectedTag !== null) {
                document.getElementById('tag-' + this.state.selectedTag.name).removeAttribute('style');
            }
            document.getElementById('tag-' + tag.name).setAttribute('style', 'background-color: ' + tag.color);
            this.setState({ selectedTag: tag });
        }
    }

    render() {
        const noDataContent = (
            <div className="p-grid p-text-center">
                <div className="p-col"><h3>NO DATA AVAILABLE</h3></div>
            </div>
        )

        return (
            <>
                {this.state.downloaded ?
                    this.state.images.length > 0 ?
                        this.state.images[this.props.count] !== undefined ?
                            <Card className="ui-card-shadow wrapper c0003" header={<TagVisualizer varTags={this.props.varTags} onTagSelected={this.onTagSelected} availTag={this.state.availTag} collz={"images"}></TagVisualizer>}>
                                <div className="p-d-flex p-flex-row-reverse p-mb-2">
                                    <Button icon="pi pi-refresh" className="p-button-outlined p-ml-2" onClick={this.startDeleteAll} />
                                    <Button icon="pi pi-trash" className="p-button-outlined p-ml-2" onClick={this.startDelete} />
                                </div>
                                <div className="cnvs-container p-mb-3" id="cnvs-container">
                                    <canvas id="c"></canvas>
                                </div>
                            </Card>
                            :
                            <Card className="ui-card-shadow wrapper" >{noDataContent}</Card>
                        :
                        <Card className="ui-card-shadow wrapper" >{noDataContent}</Card>
                    :
                    <div className="p-mt-6 p-ai-center">
                        <ProgressSpinner style={{ width: '50px', height: '50px', display: 'block' }} strokeWidth="8" animationDuration=".5s" />
                    </div>}
                <GroupButtonsFooter back={this.previousSentences} accept={this.acceptSentences} ignore={this.ignoreSentences} disabled={this.state.downloaded}></GroupButtonsFooter>
            </>
        )
    }
}