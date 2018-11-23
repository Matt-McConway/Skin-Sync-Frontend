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

        this.updateLesion = this.updateLesion.bind(this)

    }

	public render() {
        const currentLesion = this.props.currentLesion
        const { open } = this.state;
		return (
			<div className="container lesion-wrapper">
                <div className="row lesion-heading">
                    <b>Location:&nbsp;</b>{currentLesion.location}&nbsp;&nbsp;&nbsp; <b>Diameter:&nbsp;</b> {currentLesion.diameter}
                </div>
                <div className="row lesion-date">
                    <b>Date: &nbsp;</b>{currentLesion.uploaded}
                </div>
                <div className="row lesion-img-wrapper">
                    <img src={currentLesion.url}/>
                </div>
                
                <div className="row lesion-done-button">
                    <div className="btn btn-primary btn-action" onClick={this.downloadLesionImage.bind(this, currentLesion.url)}>Download</div>
                    <div className="btn btn-primary btn-action" onClick={this.onOpenModal}>Edit</div>
                    <div className="btn btn-primary btn-action" onClick={this.deleteLesion.bind(this, currentLesion.id)}>Delete</div>
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
                        <button type="button" className="btn" onClick={this.updateLesion}>Save</button>
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
    // private methodNotImplemented() {
	// 	alert("Method not implemented")
	// }

    // Open lesion image in new tab for download
    private downloadLesionImage(url: any) {
        window.open(url);
    }

    // Update lesion data (PUT)
    private updateLesion(){
        const locationInput = document.getElementById("lesion-edit-location-input") as HTMLInputElement
        const diameterInput = document.getElementById("lesion-edit-diameter-input") as HTMLInputElement
    
        // Don't allow an update if missing location or diameter data
        if (locationInput === null || diameterInput === null) {
            return;
        }
    
        const currentLesion = this.props.currentLesion
        const url = "https://skinsyncapi.azurewebsites.net/api/Lesion/" + currentLesion.id
        const updatedLocation = locationInput.value
        const updatedDiameter = diameterInput.value
        fetch(url, {
            body: JSON.stringify({
                "diameter": updatedDiameter,
                "height": currentLesion.height,
                "id": currentLesion.id,
                "location": updatedLocation,
                "uploaded": currentLesion.uploaded,
                "url": currentLesion.url,
                "width": currentLesion.width
            }),
            headers: {'cache-control': 'no-cache','Content-Type': 'application/json'},
            method: 'PUT'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error State
                alert(response.statusText + " " + url)
            } else {
                location.reload()
            }
        })
    }

    // Delete a lesion from the database - DELETE
    private deleteLesion(id: any) {
        const url = "https://skinsyncapi.azurewebsites.net/api/Lesion/" + id
    
        fetch(url, {
            method: 'DELETE'
        })
        .then((response : any) => {
            if (!response.ok) {
                // Error Response
                alert(response.statusText)
            }
            else {
                location.reload()
            }
        })
    }
}