import MediaStreamRecorder from 'msr';
import * as React from "react";


interface IProps {
    lesions: any[],
    selectNewLesion: any,
    searchByLocation: any
}

export default class LesionList extends React.Component<IProps, {}> {
    constructor(props: any) {
        super(props)   
        this.searchByLocation = this.searchByLocation.bind(this)
        this.searchLocationByVoice = this.searchLocationByVoice.bind(this)
        this.postAudio = this.postAudio.bind(this)
    }

	public render() {
		return (
			<div className="container lesion-list-wrapper">
                <div className="row lesion-list-heading">
                    <div className="input-group">
                        <div className="btn btn-outline-secondary mic-button" onClick={this.searchLocationByVoice}><i className="fa fa-microphone" /></div>
                        <input type="text" id="search-tag-textbox" className="form-control" placeholder="Search by location tag" />
                        <div className="input-group-append">
                            <div className="btn btn-outline-secondary search-button" onClick = {this.searchByLocation}>Search</div>
                        </div>
                    </div>  
                </div>
                <div className="row lesion-list-table">
                    <table className="table table-striped">
                        <tbody>
                            {this.createTable()}
                        </tbody>
                    </table>
                </div>
            </div>
		);
    }

    // Construct table using lesion list
	private createTable() {
        const table:any[] = []
        const lesionList = this.props.lesions
        table.push(<tr key="table-header-row">
            <th key="table-header-id">id</th>
            <th key="table-header-location">Location</th>
            <th key="table-header-diameter">Diameter</th>
          </tr>)
        if (lesionList == null) {
            return table
        }

        for (let i = 0; i < lesionList.length; i++) {
            const children = []
            const lesion = lesionList[i]
            children.push(<td key={"id" + i}>{lesion.id}</td>)
            children.push(<td key={"location" + i}>{lesion.location}</td>)
            children.push(<td key={"diameter" + i}>{lesion.diameter}</td>)
            table.push(<tr key={i+""} id={i+""} onClick= {this.selectRow.bind(this, i)}>{children}</tr>)
        }
        return table
    }
    
    // Lesion selection handler to display selected lesion in LesionDetail component
    private selectRow(index: any) {
        const selectedLesion = this.props.lesions[index]
        if (selectedLesion != null) {
            this.props.selectNewLesion(selectedLesion)
        }
    }

    // Search lesion by location tag
    private searchByLocation() {
        const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
        if (textBox === null) {
            return;
        }
        const location = textBox.value 
        this.props.searchByLocation(location)  
    }

    // Search lesion by location tag- voice (accessibility option)
    private searchLocationByVoice() {
        
        // Get media permission (audio)
        const mediaConstraints = {
            audio: true
        };

        const onMediaSuccess = (stream: any) => {
            const mediaRecorder = new MediaStreamRecorder(stream);
            mediaRecorder.mimeType = 'audio/wav'; // check this line for audio/wav
            mediaRecorder.ondataavailable = (blob: any) => {
                this.postAudio(blob);
                mediaRecorder.stop()
            }
            mediaRecorder.start(3000);
        }
    
        navigator.getUserMedia(mediaConstraints, onMediaSuccess, onMediaError)
    
        function onMediaError(e: any) {
            console.error('media error', e);
        }
    }

    private postAudio(blob: any){
        // Get access token for Microsoft Speach Recognition
        let accessToken: any;
        fetch('https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken', {
            headers: {
                'Content-Length': '0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Ocp-Apim-Subscription-Key': '3498bb34b9154702b825030b85cb6225'
            },
            method: 'POST'
            }).then((response) => {
                // console.log(response.text())
                return response.text()
            }).then((response) => {
                accessToken = response
            }).catch((error) => {
                console.log("Error", error)
            });
        
        // posting audio
        fetch('https://westus.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-AU', {
            body: blob, // this is a .wav audio file    
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer' + accessToken,
                'Content-Type': 'audio/wav;codec=audio/pcm; samplerate=16000',
                'Ocp-Apim-Subscription-Key': 'd6dc25ded9bd40e18c9ae4b2676c5c02'
            },    
            method: 'POST'
            }).then((res) => {
                return res.json()
            }).then((res: any) => {
                // Updating the Search box
                const textBox = document.getElementById("search-tag-textbox") as HTMLInputElement
                textBox.value = (res.DisplayText as string).slice(0, -1)
            }).catch((error) => {
                console.log("Error", error)
            });
        
        

    }

}