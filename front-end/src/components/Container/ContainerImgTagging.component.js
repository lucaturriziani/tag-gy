import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { Component } from "react";
import { getAllTag } from "../../service/db.service";
import { get, put } from "../../service/img.service";
import { brightColorRandom } from "../../utils/color";
import { deleteAll, deleteSelected, init2, loadImage } from "../../utils/imageUtils";
import { App } from "../App";
import { GroupButtonsFooter } from "./Footer/GroupButtonsFooter.component";
import { TagVisualizer } from "./Header/TagVisualizer.component";
import { Button } from 'primereact/button';
import './ContainerImgTagging.style.css';

// For imageUtils
window.$selectedTag = null;

export class ContainerImgTagging extends Component {

    constructor(props) {
        super(props);

        this.state = {
            images: null,
            selectedTag: null,
            downloaded: false,
            availTag: []
        }
    }

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
                get().then(res => {
                    const imgs = res.data;
                    if (imgs.length) {
                        console.log("response", res.data);
                        this.setState({ images: imgs });
                        this.setState({ downloaded: true }, () => {
                            if (this.state.availTag.size > 0) this.onTagSelected(this.state.availTag[this.props.count]);
                            window.$currentTag = this.state.images[this.props.count].spans;
                            init2(this.state.images[this.props.count], this.state.availTag);
                        });
                    }
                })
            });
        }).catch(err => {
            console.log("error while retriving available tags", err);
            App.visualizeToast("error", "Error", err.toString());
        })
    }

    acceptSentences = () => {
        if (this.props.count < this.state.images.length) {
            let list = this.state.images;
            console.log(window.$currentTag);
            list[this.props.count].spans = window.$currentTag;
            this.setState({ images: list });
            put(this.state.images[this.props.count]).then(res => {
                this.props.accept(100 / this.state.images.length);
            }).catch(err => {
                console.log("update", err)
            })
        }
    }

    ignoreSentences = () => {
        if (this.props.count < this.state.images.length) {
            this.props.ignore(100 / this.state.images.length);
        }
    }

    nextImages() {
        let list = this.state.images;
        list[this.props.count - 1].spans = window.$currentTag;
        this.setState({ images: list });
        if (this.state.images[this.props.count] !== undefined) {
            window.$currentTag = this.state.images[this.props.count].spans;
            loadImage(list[this.props.count]);
        }
    }

    previous() {
        console.log("count", this.props.count);
        console.log("images", this.state.images[this.props.count]);
        window.$currentTag = this.state.images[this.props.count].spans;
        loadImage(this.state.images[this.props.count]);
    }

    previousSentences = () => {
        if (this.props.count !== 0) {
            this.props.back(100 / this.state.images.length);
        }
    }

    onTagSelected = (tag) => {
        if (tag !== this.state.selectedTag) {
            if (this.state.selectedTag !== null) {
                document.getElementById('tag-' + this.state.selectedTag.name).removeAttribute('style');
            }
            document.getElementById('tag-' + tag.name).setAttribute('style', 'background-color: ' + tag.color);
            this.setState({ selectedTag: tag });
            window.$selectedTag = tag;
        }
    }

    startDelete() {
        deleteSelected();
    }

    startDeleteAll() {
        deleteAll()
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
                                <div className="cnvs-container">
                                    <canvas id="cnvs" width="600" height="400"></canvas>
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