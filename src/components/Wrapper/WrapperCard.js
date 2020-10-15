import React, { Component } from 'react';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { highlightSelection } from '../../utils';
import { colorRandom } from '../../utils/color.js';
import './WrapperCard.css'
import { Button } from 'primereact/button';

export class WrapperCard extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            tags : [{name: 'PROVA', color: null}, {name: 'PROVA1', color: null}, {name: 'PROVA2', color: null}],
            selectedTag : null
        }

        this.onTagSelected = this.onTagSelected.bind(this);
    }

    componentDidMount() {
        this.state.tags.forEach(tags => { 
            tags.color = colorRandom();
        });
        console.log("DOWNLOAD TESTO");
    }

    onTagSelected(e){
        if(e.value !== this.state.selectedTag){
            this.setState({selectedTag: e.value}, () => {
                this.op.hide();
                this.toast.show({severity:'success', summary: 'Tag selected', detail: this.state.selectedTag.name, life: 3000});
            });
        }
    }

    render() {
        const onMouseUp = () => {
            const s = window.getSelection().toString();

            console.log(s);
            if (s === '') {
                return;
            }
            let stringSelected = highlightSelection(this.state.selectedTag);
            if (stringSelected) {
                //TODO inserire stringhe selezionati
            }
        };

        const header = (
            <div className="p-grid">
                <div className="p-col-6 p-ml-4 p-mt-2">
                    <Button onClick={(e) => this.op.toggle(e)} icon="pi pi-search" label={this.state.selectedTag ? this.state.selectedTag.name : 'Select a tag'} className="select-tag-button" aria-haspopup aria-controls="overlay_panel"/>
                    <Toast className="t" ref={(el) => this.toast = el} position="top-left"/>
                    <OverlayPanel ref={(el) => this.op = el} showCloseIcon id="overlay_panel" style={{ width: '450px' }}>
                        <DataTable value={this.state.tags} selectionMode="single" paginator rows={2}
                            selection={this.state.selectedTag} onSelectionChange={this.onTagSelected}>
                            <Column field="name" header="Tag" sortable />
                        </DataTable>
                    </OverlayPanel>
                </div>
            </div>
        );
        return (
            <>
                <Card className="ui-card-shadow wrapper c0003" header={header}>
                    <div onMouseUp={onMouseUp}>{this.props.textToTag}</div>
                </Card>

            </>
        )
    }
}
