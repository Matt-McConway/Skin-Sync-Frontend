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
    }

	public render() {
		return (
			<div className="container lesion-list-wrapper">
                <div className="row lesion-list-heading">
                    <div className="input-group">
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

}