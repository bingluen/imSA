var Root = React.createClass({
	render: function() {
		if(!this.state.database) return null;
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
						<button className="btn btn-primary search-btn" type="submit" data-toggle="tooltip" data-placement="right" title="在下方建立篩選">查詢</button>
					</div>
				</form>

				<SearchResult result={this.state.result} />

				<div className="modal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				  	<div className="modal-dialog">
					    <div className="modal-content">
					      	<div className="modal-header">
						        <h4 className="modal-title" id="myModalLabel"><strong>關於作者</strong></h4>
					   		</div>
						    <div className="modal-body">
						        <h4>應芝曦 <small>Jhihsi Ying</small></h4>
						        元智大學 102級資訊管理系學生<br />
						        e-mail: jhihsiying@gmail.com
						    </div>
						    <div className="modal-footer">
						    	<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
						    </div>
					    </div>
				 	</div>
				</div>

				<div className="footer">
					<hr />
					Copyright &copy; 2015 <a href="#myModal" role="button" data-toggle="modal" id="about-text">Jhihsi Ying</a>, All Rights Reserved.
				</div>

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
			this.setState({database: data, result: data.data})
		}.bind(this))
		.fail(function(error) {
		} )
		return ({});
	},

	handleSearch: function(e){
		e.preventDefault();
		$('#search-keyword').val();
		var searchResult = this.state.database.data.filter(function(element) {
			console.log(element)
			return element.name.indexOf($('#search-keyword').val()) > -1
		});
		this.setState({result: searchResult})
	},

	componentDidUpdate: function(){
		$('[data-toggle="tooltip"]').tooltip()
	}
})

var SearchResult = React.createClass({
	classifyResult: function(result) {
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
			element.data = result.filter(function(item) {
				if( element.tag == "all") return true;
				return item.category == element.name;
			});
			return element;
		}.bind(this))
		return category;
	},
	getInitialState: function(){
		return ({pages:1, result: this.classifyResult(this.props.result)});
	},
	completeWillReceiveProps: function(nextProps) {
		this.setState({result: this.classifyResult(nextProps.result)});
	},

	render: function() {
		var pages = this.state.result.map(function(element) {
			data = {};
			$.extend(data, element);
			data.data = element.data.filter(function(element,index) {
				return index >= (this.state.pages - 1) * 10 && index < this.state.pages * 10;
			}.bind(this));
			return data;
		}.bind(this))

		var tabNav = this.state.result.map(function(element, index) {
			if (index == 0)
				return <li key={index} className="active"><a href={ '#' + element.tag} data-toggle="tab">{element.name}</a></li>
			else
				return <li key={index}><a href={ '#' + element.tag} data-toggle="tab">{element.name}</a></li>
		})

		var resultTable = pages.map(function(element, index) {
			return <ResultTable key={index} active={index == 0 ? true : false} id={element.tag} data={element.data} />
		})

		return (
			<div className="content">
				<ul className="nav nav-tabs" id="myTab">
					{tabNav}
				</ul>

				<div className="tab-content">
					{resultTable}
					<nav>
					  	<ul className="pager">
					    	<li><a href="#" onClick={this.handlePrevious}>← 上一頁</a></li>　
					    	<li><a href="#" onClick={this.handleNext}>下一頁 →</a></li>
					  	</ul>
					</nav>
				</div>
			</div>
		)
	},

	handlePrevious: function() {
		console.log('handlePrevious')
		if(this.state.pages > 1)
			this.setState({pages: this.state.pages - 1});
	},
	handleNext: function() {
		//if(this.state.pages < Math.ceil())
		length = this.state.result.filter(function(element) {
			return element.tag == $('.tab-pane.fade.active.in').attr('id');
		})[0].data.length;
		if(this.state.pages < Math.ceil(length / 10))
			this.setState({pages: this.state.pages + 1});
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
					<tbody>
						{rows}
					</tbody>
				</table>
			</div>
		)
	}
});

React.render(<Root />, $("body")[0])
