var Root = React.createClass({
	render: function() {
		return (
			<div>
				<div className="panel panel-default">
			  		<div className="panel-body">
			    		<h1>元智 i 資訊 <small>各種吃喝玩樂的訊息......</small></h1>
			  		</div>
				</div>

				<form>
					<div className="form-inline">
						<input className="form-control" placeholder="請輸入店名..." />
				  		<button className="btn btn-primary">查詢</button>
			  		</div>
				</form>

				<SearchResult />				
			</div>
		);
	}
})

var SearchResult = React.createClass({
	render: function() {

		var category = [
			{name: "葷食", tag: "mfood"},
			{name: "素食", tag: "vfood"},
			{name: "衣", tag: "cloth"},
			{name: "住", tag: "live"},
			{name: "行", tag: "traffic"},
			{name: "育", tag: "edu"},
			{name: "樂", tag: "play"},
		]

		var tabNav = category.map(function(element, index) {
			if (index == 0)
				return <li key={index} className="active"><a href={ '#' + element.tag} data-toggle="tab">{element.name}</a></li>
			else
				return <li key={index}><a href={ '#' + element.tag} data-toggle="tab">{element.name}</a></li>
		})

		var resultTable = category.map(function(element, index) {
			return <ResultTable key={index} active={index == 0 ? true : false} id={element.name} />
		})

		return (
			<div className="content">
				<ul className="nav nav-tabs" id="myTab">
					{tabNav}
				</ul>

				<div className="tab-content">
					{resultTable}
				</div>
			</div>
		)		
	}
})

ResultTable = React.createClass({
	render: function() {
		return (
			<div className={"tab-pane fade " + (this.props.active == true ? 'active in':'')} id={this.props.id}>
				<table className="table table-striped">
					<thead>
						<tr>
							<th>店名</th>
							<th>種類</th>
							<th>電話</th>
							<th>地址</th>
							<th>價位</th>
						</tr>
					</thead>
					<tr>
			       		<td>內容部份1</td>
			      		<td>內容部份2</td>
			      		<td>內容部份3</td>
			      		<td>內容部份4</td>
			      		<td>內容部份5</td>
		      		</tr>
		      		<tr>
			       		<td>內容部份1</td>
			      		<td>內容部份2</td>
			      		<td>內容部份3</td>
			      		<td>內容部份4</td>
			      		<td>內容部份5</td>
		      		</tr>
		      		<tr>
			       		<td>內容部份1</td>
			      		<td>內容部份2</td>
			      		<td>內容部份3</td>
			      		<td>內容部份4</td>
			      		<td>內容部份5</td>
		      		</tr>
				</table>
			</div>
		)
	}
});

React.render(<Root />, $("body")[0])
