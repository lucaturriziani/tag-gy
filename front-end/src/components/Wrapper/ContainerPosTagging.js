import React, { Component } from 'react';
import { Card } from 'primereact/card';
import { highlightSelection, removeAllHighlights, highlightAlredyInsert } from '../../utils/highlight';
import './ContainerPosTagging.css'
import { AcceptTag } from '../Footer/Footer';
import { App } from '../App'
import { Header } from '../Header/Header';
import { ProgressSpinner } from 'primereact/progressspinner';
import { get, put } from '../../service/pos.service';
import { getAllTag } from '../../service/db.service';
import { colorRandom } from '../../utils/color';

export class ContainerPosTagging extends Component {

    constructor(props) {
        super(props);

        this.state = {
            sentences: null,
            selectedTag: null,
            downloaded: false,
            availTag: []
        }

        this.onTagSelected = this.onTagSelected.bind(this);
    }

    componentDidMount() {
        window.$currentTag = [];
        getAllTag("").then(res => {
            console.log("response tags", res.data)
            let distTag = res.data;
            distTag = distTag.map(item => {
                let tag = {
                    name: item,
                    color: colorRandom()
                }
                return tag;
            });
            this.setState({ availTag: distTag }, () => {
                get().then(res => {
                    const phrases = res.data;
                    if (phrases.length) {
                        console.log("response", res.data);
                        window.$currentTag = phrases[0].spans
                        this.setState({ sentences: phrases });
                        this.setState({ downloaded: true });
                        highlightAlredyInsert(this.state.sentences[this.props.count].spans, this.state.availTag);
                    }
                })
            });
        }).catch(err => {
            console.log("error while retriving available tags", err);
            App.visualizeToast("error", "Error", err.toString());
        })
    }

    acceptSentences = () => {
        if (this.props.count < this.state.sentences.length) {
            console.log(this.state.sentences[this.props.count]);
            put(this.state.sentences[this.props.count]).then(res => {
                this.nextSententes();
                this.props.accept(100 / this.state.sentences.length);
            }).catch(err => {
                console.log("update", err)
            })
        }
    }

    ignoreSentences = () => {
        if (this.props.count < this.state.sentences.length) {
            this.nextSententes();
            this.props.ignore(100 / this.state.sentences.length);
        }
    }

    nextSententes() {
        let list = this.state.sentences;
        list[this.props.count].spans = window.$currentTag;
        this.setState({ sentences: list });
        removeAllHighlights();
    }

    previousSentences = () => {
        if (this.props.count !== 0) {
            removeAllHighlights();
            this.props.back(100 / this.state.sentences.length);
        }
    }

    highlight() {
        if (this.state.sentences[this.props.count] !== undefined) {
            if (this.state.sentences[this.props.count].spans) {
                window.$currentTag = this.state.sentences[this.props.count].spans
                highlightAlredyInsert(this.state.sentences[this.props.count].spans, this.state.availTag)
            }
        }
    }

    onTagSelected = (tag) => {
        if (tag !== this.state.selectedTag) {
            if (this.state.selectedTag !== null) {
                document.getElementById('tag-' + this.state.selectedTag.name).removeAttribute('style');
            }
            document.getElementById('tag-' + tag.name).setAttribute('style', 'background-color: ' + tag.color);
            this.setState({ selectedTag: tag });
        }
    }

    render() {
        const onMouseUp = () => {
            const s = window.getSelection().toString();

            if (s === '') {
                return;
            }

            if (this.state.selectedTag == null) {
                App.visualizeToast('error', 'No tag selected', 'Please select or insert a tag');
                window.getSelection().removeAllRanges();
                return;
            }

            let [startId, endId, stringSelected] = highlightSelection(this.state.selectedTag);
            if (startId !== null && endId !== null && stringSelected !== null) {
                window.$currentTag.push({
                    start: startId,
                    end: endId,
                    token: stringSelected,
                    label: this.state.selectedTag.name
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

        const noDataContent = (
            <div className="p-grid p-text-center">
                <div className="p-col"><h3>NO DATA AVAILABLE</h3></div>
            </div>
        )
        return (
            <>
                {this.state.downloaded ?
                    this.state.sentences.length > 0 ?
                        this.state.sentences[this.props.count] !== undefined ?
                            <Card className="ui-card-shadow wrapper c0003" header={<Header varTags={this.props.varTags} onTagSelected={this.onTagSelected} availTag={this.state.availTag}></Header>}>
                                <div onMouseUp={onMouseUp}>{divideText(this.state.sentences[this.props.count].text).map((item, index) => {
                                    return <span className='c0002' id={index} key={index}>{item}</span>
                                })}
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
                <AcceptTag back={this.previousSentences} accept={this.acceptSentences} ignore={this.ignoreSentences} disabled={this.state.downloaded}></AcceptTag>
            </>
        )
    }
}
