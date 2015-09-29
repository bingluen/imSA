var Root = React.createClass({
	render: function() {
		if(!this.state.database) return null;
		return (
			<div>

				<div className="panel panel-default" id="main-panel">
					<div className="panel-body">
					   	<h1>元智 i 資訊 <small>各種吃喝玩樂的訊息......</small></h1>
					</div>
				</div>

				<form onSubmit={this.handleSearch}>
					<div className="input-group" id="search-input">
						<input id="search-keyword" className="form-control" placeholder="請輸入至少一字店名..."/>
						<span className="input-group-btn">
							<button className="btn btn-primary" type="submit" data-toggle="tooltip" data-placement="top" title="在下方建立篩選">查詢</button>
							<button className="btn btn-success" onClick={this.cleanSearch}>全部列出</button>
						</span>
					</div>
				</form>

				<SearchResult result={this.state.result}/>

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
		.done(function(response){
			this.setState({database: response, result: response.data})
			// 因為搜尋結果會一直用到改變的database，為不要動到母資料，所以另外複製一筆資料給result
			// database裡面可能含有其他資訊，所以是整個response給它。這邊result只需要拿json檔裡的data屬性，所以response.data
		}.bind(this))
		.fail(function(error) {
		} )
		return ({});
	},

	handleSearch: function(e){
		e.preventDefault();
		$('#search-keyword').val();
		var searchResult = this.state.database.data.filter(function(element) {
			return element.name.indexOf($('#search-keyword').val()) > -1
		});
		this.setState({result: searchResult})
	},

	cleanSearch: function(e){
		e.preventDefault();
		$('#search-keyword').val("")
		this.setState({result: this.state.database.data})
	},

	componentDidUpdate: function(){
		$('[data-toggle="tooltip"]').tooltip()
	}

})

var SearchResult = React.createClass({
	classifyResult: function(result) {
		var category = [
			{name: "全部列出", tag:"all"},
			{name: "葷食", tag: "mfood"},
			{name: "素食", tag: "vfood"},
			{name: "衣", tag: "cloth"},
			{name: "住", tag: "live"},
			{name: "行", tag: "traffic"},
			{name: "育", tag: "edu"},
			{name: "樂", tag: "play"},
			{name: "銀行", tag: "bank"},
			{name: "綜合", tag: "comprehensive"},
		]

		category = category.map(function(element) {
			if(element.tag == 'all')
				element.data = result;
			else {
				element.data = result.filter(function(item) {
					return item.category == element.name;
				});
			}
			return element;
		}.bind(this))
		return category;
	},
	getInitialState: function(){
		return ({pages:1, result: this.classifyResult(this.props.result), location:{lat: 24.969905, lng:121.266478} });
	},
	componentWillReceiveProps: function(nextProps) {
		this.setState({result: this.classifyResult(nextProps.result)}); //reset tab label to all
		this.setState({pages:1}); //按下「全部列出」時回到第一頁
		$('#myTab > li').removeClass('active').first().addClass('active');
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
			return <ResultTable key={index} active={index == 0 ? true : false} id={element.tag} data={element.data} modalClick={this.showModal}/>
		}.bind(this))

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

				<div className="modal fade" id="myModal_2" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<h4 className="modal-title" id="myModalLabel">
									<strong ref="title"></strong>
								</h4>
							</div>
							<div className="modal-body">
								<p><span className="glyphicon glyphicon-info-sign" aria-hidden="true"></span> 種類：<span ref="category"></span></p>
								<p><span className="glyphicon glyphicon-earphone" aria-hidden="true"></span> 電話：<span ref="tel"></span></p>
								<p><span className="glyphicon glyphicon-home" aria-hidden="true"></span> 地址：<span ref="address"></span></p>
								<p><span className="glyphicon glyphicon-usd" aria-hidden="true"></span> 價位：<span ref="averagePrice"></span></p>
								<p><span className="glyphicon glyphicon-edit" aria-hidden="true"></span> 備註：</p>
								<p><span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span> 地圖：</p>
								<div id="map" ref="map"></div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	},

	handlePrevious: function() {
		if(this.state.pages > 1)
			this.setState({pages: this.state.pages - 1});
	},
	handleNext: function() {
		length = this.state.result.filter(function(element) {
			return element.tag == $('.tab-pane.fade.active.in').attr('id');
		})[0].data.length;
		if(this.state.pages < Math.ceil(length / 10))
			this.setState({pages: this.state.pages + 1});
	},

	/*利用jQuery把element寫入店家固定modal*/
	showModal: function(element) {
		$(React.findDOMNode(this.refs.title)).html(element.name);
		$(React.findDOMNode(this.refs.category)).html(element.category);
		$(React.findDOMNode(this.refs.tel)).html(element.tel);
		$(React.findDOMNode(this.refs.address)).html(element.address);
		$(React.findDOMNode(this.refs.averagePrice)).html(element.averagePrice);
		$.ajax({
			url: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + element.address,
			type: 'get',
			dataType: 'json',
		})
		.done(function(response) {

			var marker = new google.maps.Marker(
			{
				position: google.maps.LatLng(
					response.results[0].geometry.location.lat,
					response.results[0].geometry.location.lng
				),
				title: element.name,
				map: this.state.map
			});

			console.log(marker)

			this.state.map.setCenter(marker.getPosition());

			$('#myModal_2').modal('show');
		}.bind(this))
		.fail(function() {
			console.log("error");
		});

	},
	componentDidMount: function() {
		var state = this.state;
		var map = new google.maps.Map(React.findDOMNode(this.refs.map), {
			zoom: 16,
			center: {lat: state.location.lat, lng: state.location.lng}
		});
    this.setState({map: map});
		$('#myTab > li').click(function() {
			this.setState({pages: 1})
		}.bind(this))
	}
})

ResultTable = React.createClass({

	/*render裡的this.handleClick呼叫此function，此function再呼叫modalClick*/
	handleClick: function(element) {
		this.props.modalClick(element);
	},

	render: function() {
		var rows = this.props.data.map(function(element,index){
			return (
				<tr key={index}>
					<td><a href="#" onClick={this.handleClick.bind(this, element)}>{element.name}</a></td>
					<td>{element.category}</td>
					<td>{element.tel}</td>
					<td className="tableAddress">{element.address}</td>
					<td className="tablePrice">{element.averagePrice}</td>
				</tr>
			)
		}.bind(this))

		return (
			<div className="tab-pane fade " id={this.props.id} ref="tab">
				<table className="table table-striped">
					<thead>
						<tr>
							<th className="tableName">店名</th>
							<th className="tableCategory">種類</th>
							<th ckassName="tableTel">電話</th>
							<th className="tableAddress">地址</th>
							<th className="tablePrice">價位</th>
						</tr>
					</thead>
					<tbody>
						{rows}
					</tbody>
				</table>
			</div>
		)
	},
	componentDidUpdate: function() {
		this.settingVisible();
	},
	componentDidMount: function() {
		this.settingVisible();
	},
	settingVisible: function() {
		if(this.props.active) {
			$(React.findDOMNode(this.refs.tab)).addClass('active in');
		} else {
			$(React.findDOMNode(this.refs.tab)).removeClass('active in');
		}
	}
});

React.render(<Root />, $("body")[0])
