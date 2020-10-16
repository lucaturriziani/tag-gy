import React, { Component } from 'react';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { highlightSelection, removeAllHighlights, highlightAlredyInsert } from '../../utils/highlight';
import { colorRandom } from '../../utils/color.js';
import './ContainerPosTagging.css'
import { Button } from 'primereact/button';
import { AcceptTag } from '../Footer/Footer';

export class ContainerPosTagging extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tagg: [{ name: 'PROVA', color: [] }, { name: 'PROVA1', color: [] }, { name: 'PROVA2', color: [] }],
            sentences: ["L'università può essere un vero schifo", "Figa che bella la figa che balla, citazione del sommo maestro"],
            selectedTag: null,
            count: 0
        }

        this.tagged = [];
        this.onTagSelected = this.onTagSelected.bind(this);
    }

    acceptSentences = () => {
        if (this.state.count <= this.state.sentences.length - 1) {
            this.props.accept(100 / this.state.sentences.length);
            this.changeSentences('+');
        }
    }

    rejectSentences = () => {
        if (this.state.count <= this.state.sentences.length - 1) {
            this.props.reject(100 / this.state.sentences.length);
            this.changeSentences('+');
        }
    }

    ignoreSentences = () => {
        if (this.state.count <= this.state.sentences.length - 1) {
            this.props.ignore(100 / this.state.sentences.length);
            this.changeSentences('+');
        }
    }

    changeSentences(operation) {
        if ((String(operation) === '+' && this.state.count < this.state.sentences.length - 1) ||
            (String(operation) === '-' && this.state.count !== 0)) {
            removeAllHighlights();
            this.setState(state => {
                const tags = state.tagg;
                const selectedTag = state.selectedTag;
                const sentences = state.sentences;
                let count;
                switch (String(operation)) {
                    case '+': {
                        count = state.count + 1;
                        break;
                    }
                    case '-': {
                        count = state.count - 1;
                        break;
                    }
                    default: break;
                }

                if (this.tagged[count]) {
                    highlightAlredyInsert(this.tagged[count])
                }

                return {
                    sentences,
                    count,
                    tags,
                    selectedTag
                };

            });
        } else if (this.state.count > this.state.sentences.length - 1) {
            this.setState({ count: this.state.sentences.length });
        }
    }

    previousSentences = () => {
        if(this.state.count !== 0){
            this.props.back(100 / this.state.sentences.length);
            this.changeSentences('-');
        }
    }

    componentDidMount() {
        this.state.tagg.forEach(tag => {
            tag.color = colorRandom();
        });
        this.state.sentences.forEach(s => {
            this.tagged.push([])
        })
        this.setState({ selectedTag: this.state.tagg[0] });
    }

    onTagSelected(e) {
        if (e.value !== this.state.selectedTag) {
            this.setState({ selectedTag: e.value }, () => {
                this.op.hide();
            });
        }
    }

    render() {
        const onMouseUp = () => {

            if (this.state.selectedTag == null) {
                this.toast.show({ severity: 'error', summary: 'Error', detail: 'Please select a tag', life: 3000 });
                window.getSelection().removeAllRanges();
                return;
            }

            const s = window.getSelection().toString();

            console.log(s);
            if (s === '') {
                return;
            }
            let [startId, endId, stringSelected] = highlightSelection(this.state.selectedTag);
            console.log(startId+" "+endId)
            if (startId !== null && endId !== null && stringSelected !== null) {
                this.tagged[this.state.count].push({
                    startId: startId,
                    endId: endId,
                    string: stringSelected,
                    tag: this.state.selectedTag
                });
            }
        };

        const divideText = (text) => {
            text = String(text).replace(",", " ,")
                .replace(".", " .")
                .replace("-", " -")
                .replace("?", " ?")
                .replace("!", " !")
                .replace("%", " %")
                .replace("'", " ' ")
                .replace("\"", " \" ");
            const splitted = String(text).split(" ");
            return splitted;
        }

        const header = (
            <div className="p-grid">
                <div className="p-col-12 p-md-6 p-ml-2 p-ml-md-4 p-mt-2">
                    <Button onClick={(e) => this.op.toggle(e)} icon="pi pi-search" label={this.state.selectedTag ? this.state.selectedTag.name : 'Select a tag'} className="select-tag-button" aria-haspopup aria-controls="overlay_panel" />
                    <OverlayPanel ref={(el) => this.op = el} showCloseIcon id="overlay_panel" style={{ width: '450px' }}>
                        <DataTable value={this.state.tagg} selectionMode="single" paginator rows={2}
                            selection={this.state.selectedTag} onSelectionChange={this.onTagSelected}>
                            <Column field="name" header="Tag" sortable />
                        </DataTable>
                    </OverlayPanel>
                </div>
            </div>
        );

        const noDataContent = (
            <div className="p-grid p-text-center">
                <div className="p-col"><h3>NO DATA AVAILABLE</h3></div>
            </div>
        )
        return (
            <>
                <Toast className="t" ref={(el) => this.toast = el} position="top-center" />
                {this.state.sentences[this.state.count] !== undefined ?
                    <Card className="ui-card-shadow wrapper c0003" header={header}>
                        <div onMouseUp={onMouseUp}>{divideText(this.state.sentences[this.state.count]).map((item, index) => {
                            return <span className='c0002' id={index} key={index}>{item}</span>
                        })}
                        </div>
                    </Card> :
                    <Card className="ui-card-shadow wrapper" >{noDataContent}</Card>
                }
                <AcceptTag back={this.previousSentences} accept={this.acceptSentences}
                    reject={this.rejectSentences} ignore={this.ignoreSentences}></AcceptTag>
            </>
        )
    }
}
