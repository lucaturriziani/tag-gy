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

window.$currentTag = []

export class ContainerPosTagging extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tagg: [{ name: 'PROVA', color: [] }, { name: 'PROVA1', color: [] }, { name: 'PROVA2', color: [] }],
            sentences: ["Everyone knows all about my transgressions still in my heart somewhere, there's melody and harmony for you and me, tonight", "Figa che bella la figa che balla, citazione del sommo maestro", "But the way that we love in the night gave me life baby, I can't explain"],
            selectedTag: null,
            highlight: () => {highlightAlredyInsert(this.tagged[this.props.count])}
        }

        this.tagged = [];
        this.onTagSelected = this.onTagSelected.bind(this);
    }

    acceptSentences = () => {
        if (this.props.count < this.state.sentences.length) {
            this.tagged[this.props.count] = window.$currentTag 
            removeAllHighlights();
            this.props.accept(100 / this.state.sentences.length);
        }
    }

    rejectSentences = () => {
        if (this.props.count < this.state.sentences.length) {
            this.tagged[this.props.count] = window.$currentTag 
            removeAllHighlights();
            this.props.reject(100 / this.state.sentences.length);
        }
    }

    ignoreSentences = () => {
        if (this.props.count < this.state.sentences.length) {
            this.tagged[this.props.count] = window.$currentTag 
            removeAllHighlights();
            this.props.ignore(100 / this.state.sentences.length);
        }
    }

    previousSentences = () => {
        if (this.props.count !== 0) {
            removeAllHighlights();
            this.props.back(100 / this.state.sentences.length);
        }
    }

    highlight(){
        if(this.tagged[this.props.count]){
            window.$currentTag = this.tagged[this.props.count]
            highlightAlredyInsert(this.tagged[this.props.count])
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

            if (s === '') {
                return;
            }
            let [startId, endId, stringSelected] = highlightSelection(this.state.selectedTag);
            if (startId !== null && endId !== null && stringSelected !== null) {
                window.$currentTag.push({
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
                .replace("'", " '")
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
                {this.state.sentences[this.props.count] !== undefined ?
                    <Card className="ui-card-shadow wrapper c0003" header={header}>
                        <div onMouseUp={onMouseUp}>{divideText(this.state.sentences[this.props.count]).map((item, index) => {
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

export {};