import * as React from "react";
import Modal from 'react-responsive-modal';

interface IProps {
    currentLesion: any
}

interface IState {
    open: boolean
}

export default class LesionDetail extends React.Component<IProps, IState> {

    constructor(props: any) {
        super(props)   
        this.state = {
            open: false
        }

    }

	public render() {
        const currentLesion = this.props.currentLesion
        const { open } = this.state;
		return (
			<div className="container lesion-wrapper">
                <div className="row lesion-heading">
                    <b>{currentLesion.location}</b>&nbsp; {currentLesion.diameter}
                </div>
                <div className="row lesion-date">
                    {currentLesion.uploaded}
                </div>
                <div className="row lesion-img-wrapper">
                    <img src={currentLesion.url}/>
                </div>
                
                <div className="row lesion-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.downloadLesionImage.bind(this, currentLesion.url)}>Download</div>
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit</div>
                    <div className="btn btn-primary btn-action" onClick={this.methodNotImplemented.bind(this, currentLesion.id)}>Delete</div>
                </div>
                <Modal open={open} onClose={this.onCloseModal}>
                    <form>
                        <div className="form-group">
                            <label>Location</label>
                            <input type="text" className="form-control" id="lesion-edit-location-input" placeholder="Enter Location"/>
                            <small className="form-text text-muted">Location is used for search</small>
                        </div>
                        <div className="form-group">
                            <label>Diameter</label>
                            <input type="text" className="form-control" id="lesion-edit-diameter-input" placeholder="Enter Diameter"/>
                            <small className="form-text text-muted">Size of lesion in mm</small>
                        </div>
                        <button type="button" className="btn" onClick={this.methodNotImplemented}>Save</button>
                    </form>
                </Modal>
            </div>
		);
    }

    // Modal Open
    private onOpenModal = () => {
        this.setState({ open: true });
	  };
    
    // Modal Close
    private onCloseModal = () => {
		this.setState({ open: false });
    };
    
    // Generic not implemented placeholder
    private methodNotImplemented() {
		alert("Method not implemented")
	}

    // Open lesion image in new tab for download
    private downloadLesionImage(url: any) {
        window.open(url);
    }
}