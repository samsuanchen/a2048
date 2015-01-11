
var maincomponent = React.createClass({
  getInitialState:function() {
  	return {score:0, max:0, time:0, cells:[
      [11,12,13,14],[21,22,23,24],[31,32,33,34],[41,42,43,44]
    ]};
  },
  renderBoxs:function(item) {
    return <td>{item?item:''}</td>
  },
  renderRows:function(row) {
    return <tr>{row.map(this.renderBoxs)}</tr>;
  },
  render: function() {
    return <div>
      <h4>鍵盤上 按 ↑ ↓ ← → 或 w s a d 或者</h4>
      <h4>手指在 表格 之中 向 上下左右 滑動</h4>
      <h4>數值都依方向移動 碰相同值就相加</h4>
      <h4>累計相加值 即此 2048 遊戲的 得分</h4><br/>
      <h4>點左下角開始</h4><br/>
      得分<span id="score">{this.state.score}</span> &nbsp;
      最高<span id="max">{this.state.max}</span> &nbsp;
      剩餘<span id="time">{this.state.time}秒</span><br/>
      <button onClick={this.changedata}>change</button>
      <table border="1">
        {this.state.cells.map(this.renderRows)}
      </table>
    </div>;
  },
  changedata:function() {
    var table=[], sum=m=0, n;
    for (var i=1;i<=4;i++) {
      var row=[];
      for (var j=1;j<=4;j++) {
        n=Math.floor(Math.random()*5);
        sum+=n, m=n>m?n:m;
        row.push(n);
      }
      table.push(row)
    }
    this.setState({cells:table,score:sum,max:m});
  }
});
module.exports=maincomponent;