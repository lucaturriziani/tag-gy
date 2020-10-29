import React, { Component } from 'react';
import { Card } from 'primereact/card';
import { highlightSelection, removeAllHighlights, highlightAlredyInsert } from '../../utils/highlight';
import './ContainerPosTagging.css'
import { AcceptTag } from '../Footer/Footer';
import { App } from '../App'
import { Header } from '../Header/Header';
import Axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';

window.$currentTag = []

export class ContainerPosTagging extends Component {

    constructor(props) {
        super(props);

        this.state = {
            //sentences: ["Everyone knows all about my transgressions still in my heart somewhere, there's melody and harmony for you and me, tonight", "And maybe that's the price you pay for the money and fame at an early age", "But the way that we love in the night gave me life baby, I can't explain", "And now it's clear as this promise that we're making two reflections into one 'cause it's like you're my mirror"],
            sentences: null,
            selectedTag: null,
            downloaded: false
        }

        this.tagged = [];
        this.tagg = [];
        this.onTagSelected = this.onTagSelected.bind(this);
    }

    componentDidMount() {
        /*this.state.sentences.forEach(s => {
            this.tagged.push([]);
            this.tagg.push([]);
        })*/
        Axios.get(`http://localhost:3000`)
            .then(res => {
                const phrases = res.data;
                phrases.forEach(p => {
                    this.tagged.push([]);
                    this.tagg.push([]);
                })
            this.setState({sentences : phrases});
            this.setState({ downloaded: true });
        })
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

    highlight() {
        const divTag = document.querySelectorAll('*[id^="tag-"]');
        divTag.forEach(div => {
            div.removeAttribute('style');
        })
        this.setState({selectedTag: null});
        if (this.tagged[this.props.count]) {
            window.$currentTag = this.tagged[this.props.count]
            highlightAlredyInsert(this.tagged[this.props.count])
        }
    }

    onTagSelected = (tag) => {
        if (tag !== this.state.selectedTag) {
            if (this.state.selectedTag !== null) {
                document.getElementById('tag-' + this.state.selectedTag.name).removeAttribute('style');
            }
            document.getElementById('tag-' + tag.name).setAttribute('style', 'background-color: var(--primary-color');
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
                            <Card className="ui-card-shadow wrapper c0003" header={<Header onTagSelected={this.onTagSelected} tagg={this.tagg} count={this.props.count}></Header>}>
                                <div onMouseUp={onMouseUp}>{divideText(this.state.sentences[this.props.count]).map((item, index) => {
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
                <AcceptTag back={this.previousSentences} accept={this.acceptSentences}
                    reject={this.rejectSentences} ignore={this.ignoreSentences} disabled={this.state.downloaded}></AcceptTag>
            </>
        )
    }
}
