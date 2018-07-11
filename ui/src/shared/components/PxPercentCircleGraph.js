import React, {Component} from 'react'
class PxPercentCircleGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {curValue: 5}
  }

  componentWillMount() {}

  componentDidUpdate(prevProps) {
    if (prevProps.completeValue !== this.props.completeValue) {
      this.setState({curValue: this.props.completeValue})
    }
  }

  render() {
    // const {completeValue} = this.props
    return (
      <px-percent-circle val={this.state.curValue} max="100" thickness="30" />
    )
  }
}

export default PxPercentCircleGraph
