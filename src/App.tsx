import * as React from 'react';
import Modal from 'react-responsive-modal';
import * as Webcam from 'react-webcam';
import './App.css';
import LesionDetail from './components/LesionDetail';
import LesionList from './components/LesionList';
import Logo from './Logo.png';




interface IState {
	currentLesion: any,
	lesions: any[],
	open: boolean,
	uploadFileList: any,
	refCamera: any,
	capture: any
}

class App extends React.Component<{}, IState> {
	constructor(props: any) {
        super(props)
        this.state = {
			capture: null,
			currentLesion: {"id":0, "location":"Loading ","url":"","diameter":"","uploaded":"","width":"0","height":"0"},
			lesions: [],
			open: false,
			refCamera: React.createRef(),
			uploadFileList: null
		}
		
		// Binding methods     	
		this.selectNewLesion = this.selectNewLesion.bind(this)
		this.fetchLesions = this.fetchLesions.bind(this)
		this.fetchLesions("")
		this.handleFileUpload = this.handleFileUpload.bind(this)
		this.uploadLesion = this.uploadLesion.bind(this)
		this.captureImage = this.captureImage.bind(this)
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
			{/* Start of upload modal */} 
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
						<br />
						<Webcam 
							audio={false}
							screenshotFormat="image/jpeg"
							ref={this.state.refCamera}
							height={240}
							width={426}
						/>
						<br />
						<button type="button" className="btn btn-primary btn-action" onClick={this.captureImage}>Capture</button>
						{ this.state.capture ? <a href={this.state.capture} download="lesion.jpeg">Download Captured Image</a>: null }
						{/* <div className="btn" ><i className="fa fa-camera" /></div> */}
						<input type="file" onChange={this.handleFileUpload} className="form-control-file" id="lesion-image-input" />
						
					</div>

					<button type="button" className="btn btn-primary btn-action" onClick={this.uploadLesion}>Upload</button>
				</form>
			</Modal>
			{/* End of upload modal */} 
			<div className="footer-wrapper">
					<h6>Created by Matt McConway - 2018</h6>
			</div>
		</div>
		);
	}

	// Upload Modal open
	private onOpenModal = () => {
		this.setState({ open: true });
	  };
	
	// Upload Modal close
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

	// Post take uploaded files into state
	private handleFileUpload(fileList: any) {
		this.setState({
			uploadFileList: fileList.target.files
		})
	}

	private uploadLesion() {
		const locationInput = document.getElementById("lesion-location-input") as HTMLInputElement
		const diameterInput = document.getElementById("lesion-diameter-input") as HTMLInputElement
		const imageFile = this.state.uploadFileList[0]
		
		// Don't POST if any field is missing
		if (locationInput === null || diameterInput === null || imageFile === null) {
			return;
		}
		
		const locationTag = locationInput.value // Had to rename to locationTag to avoid clash with location.reload after POSTing
		const diameter = diameterInput.value
		const url = "https://skinsyncapi.azurewebsites.net/api/Lesion/upload"
	
		const formData = new FormData()
		formData.append("Location", locationTag)
		formData.append("Diameter", diameter)
		formData.append("image", imageFile)
	
		fetch(url, {
			body: formData,
			headers: {'cache-control': 'no-cache'},
			method: 'POST'
		})
		.then((response : any) => {
			if (!response.ok) {
				// Error State
				alert(response.statusText + ' - Check your input data and try again later.')
			} else {
				location.reload()
			}
		})
	}

	private captureImage(){
		const image = this.state.refCamera.current.getScreenshot()
		this.setState({ capture: image})
		console.log(this.state.capture)
	}


}

export default App;
