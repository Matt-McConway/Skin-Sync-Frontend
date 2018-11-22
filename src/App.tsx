import * as React from 'react';
import Modal from 'react-responsive-modal';
import './App.css';
import LesionDetail from './components/LesionDetail';
import LesionList from './components/LesionList';
import Logo from './Logo.png';


interface IState {
	currentLesion: any,
	lesions: any[],
	open: boolean,
	uploadFileList: any,
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			currentLesion: {"id":0, "location":"Loading ","url":"","diameter":"","uploaded":"","width":"0","height":"0"},
			lesions: [],
			open: false,
			uploadFileList: null
		}
		
		// Binding methods     	
		this.selectNewLesion = this.selectNewLesion.bind(this)
		this.fetchLesions = this.fetchLesions.bind(this)
		this.fetchLesions("")
	}

	public render() {
		const { open } = this.state;
		return (
		<div className="app-wrapper">
			<div className="header-wrapper">
				<div className="container header">
					<img src={Logo} height='32' />
					<div className="btn btn-primary btn-action btn-add" onClick={this.onOpenModal}>Upload</div>
				</div>
			</div>
			<div className="container">
				<div className="row">
					<div className="col-7">
						<LesionDetail currentLesion={this.state.currentLesion} />
					</div>
					<div className="col-5">
						<LesionList lesions={this.state.lesions} selectNewLesion={this.selectNewLesion} searchByLocation={this.fetchLesions}/>
					</div>
				</div>
			</div>
			<Modal open={open} onClose={this.onCloseModal}>
				<form>
					<div className="form-group">
						<label>Location</label>
						<input type="text" className="form-control" id="lesion-location-input" placeholder="Enter Location of Lesion" />
						<small className="form-text text-muted">Location is used for search</small>
					</div>
					<div className="form-group">
						<label>Diameter</label>
						<input type="text" className="form-control" id="lesion-diameter-input" placeholder="Enter Diameter of Lesion" />
						<small className="form-text text-muted">Size of lesion in mm</small>
					</div>
					<div className="form-group">
						<label>Image</label>
						<input type="file" onChange={this.methodNotImplemented} className="form-control-file" id="lesion-image-input" />
					</div>

					<button type="button" className="btn" onClick={this.methodNotImplemented}>Upload</button>
				</form>
			</Modal>
			<div className="footer-wrapper">
				{/* <div className="footer"> */}
					<h6>Created by Matt McConway - 2018</h6>
				{/* </div> */}
			</div>
		</div>
		);
	}

	// Default not implemented method
	private methodNotImplemented() {
		alert("Method not implemented")
	}

	// Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	  };
	
	// Modal close
	private onCloseModal = () => {
		this.setState({ open: false });
	};
	
	// Change selected skin lesion
	private selectNewLesion(newLesion: any) {
		this.setState({
			currentLesion: newLesion
		})
	}

	// Fetch all lesions from API
	private fetchLesions(location: any) {
		let url = "https://skinsyncapi.azurewebsites.net/api/Lesion/"
		if (location !== "") {
			url += "lesion?location=" + location
		}
		fetch(url, {
			method: 'GET'
		})
		.then(res => res.json())
		.then(json => {
			let currentLesion = json[0]
			if (currentLesion === undefined) {
				currentLesion = {"id":0, "location":"No lesions in search","url":"","diameter":"","uploaded":"","width":"0","height":"0"}
			}
			this.setState({
				currentLesion,
				lesions: json
			})
		});
	}
}

export default App;
