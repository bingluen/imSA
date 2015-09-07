var Root = React.createClass({
	render: function() {
		return (
			<div>
				<h1>imSA 元智i資訊</h1>
				<div class="input-group">
		  			<span class="input-group-addon">我想查詢</span>
		  			<input type="text" class="form-control" placeholder="店家名稱">
				</div>
			</div>
		);
	}
})

React.render(<Root />, $("body")[0])