var Root = React.createClass({
	render: function() {
		console.log(this.state.result)
		return (
			<div>
				<div className="panel panel-default">
			  		<div className="panel-body">
			    		<h1>元智 i 資訊 <small>各種吃喝玩樂的訊息......</small></h1>
			  		</div>
				</div>

				<form onSubmit={this.handleSearch}>
					<div className="form-inline">
						<input id="search-keyword" className="form-control" placeholder="請輸入店名..." />
				  		<button className="btn btn-primary search-btn" type="submit">查詢</button>
			  		</div>
				</form>

				<SearchResult result={this.state.result} />				
			</div>
		);
	},

	getInitialState: function(){

		var database;

		$.ajax({
			url: 'data.json',
			type: 'get',
			dataType: 'json',
		})
		.done(function(data){
			database = data;
		})
		return ({database: database, result: database});
	},

	handleSearch: function(){
		$('#search-keyword').val();
		var searchResult = this.state.database.data.filter(function(element) {
			return element.indexOf($('#search-keyword').val()) > -1
		});
		this.setState({result: searchResult})
	}	
})

var SearchResult = React.createClass({
	render: function() {

		var category = [
			{name: "全部展開", tag:"all"},
			{name: "葷食", tag: "mfood"},
			{name: "素食", tag: "vfood"},
			{name: "衣", tag: "cloth"},
			{name: "住", tag: "live"},
			{name: "行", tag: "traffic"},
			{name: "育", tag: "edu"},
			{name: "樂", tag: "play"},
		]

		category = category.map(function(element) {
			element.data = this.props.result.filter(function(item) {
				if( element.tag == "all") return true;
				return item.category == element.name;
			});
		}.bind(this))

		var tabNav = category.map(function(element, index) {
			if (index == 0)
				return <li key={index} className="active"><a href={ '#' + element.tag} data-toggle="tab">{element.name}</a></li>
			else
				return <li key={index}><a href={ '#' + element.tag} data-toggle="tab">{element.name}</a></li>
		})

		var resultTable = category.map(function(element, index) {
			return <ResultTable key={index} active={index == 0 ? true : false} id={element.name} data={element.data}/>
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

		var rows = this.props.data.map(function(element,index){
			return (
				<tr key={index}>
					<td>{element.name}</td>
					<td>{element.category}</td>
					<td>{element.tel}</td>
					<td>{element.address}</td>
					<td>{element.price.lower} ~ {element.price.upper}</td>
				</tr>
			)
		})

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
