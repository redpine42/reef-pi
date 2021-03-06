import React from 'react'
import {ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line} from 'recharts'
import $ from 'jquery'
import {connect} from 'react-redux'

class chart extends React.Component {
  constructor (props) {
    super(props)
    this.channel2line = this.channel2line.bind(this)
  }

  channel2line (ch, data) {
    if (ch.profile.type === 'auto' && ch.profile.config) {
      $.each(ch.profile.config.values, function (i, value) {
        if (data[i] === undefined) {
          data[i] = {time: (i * 2) + 'h'}
        }
        data[i][ch.name] = value
      })
      var stroke = ch.color === '' ? '#000' : ch.color
      return (
        <Line
          dataKey={ch.name}
          isAnimationActive={false}
          stroke={stroke}
          key={ch.pin}
        />
      )
    }
  }

  render () {
    if (this.props.config === undefined) {
      return <div />
    }
    var lines = [
      <Line dataKey='time'
        isAnimationActive={false}
        stroke='#000000'
        key='time'
        layout='vertical'
      />
    ]
    var data = []
    data['time'] = [12]
    $.each(this.props.config.channels, function (name, channel) {
      lines.push(this.channel2line(channel, data))
    }.bind(this))
    return (
      <div className='container'>
        <span className='h6'>Light - {this.props.config.name}</span>
        <ResponsiveContainer height={this.props.height} width='100%'>
          <LineChart data={data}>
            <XAxis dataKey='time' />
            <YAxis />
            <Tooltip />
            {lines}
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
  }
}
const mapStateToProps = (state, ownProps) => {
  return {
    config: state.lights.find((l) => {
      return l.id === ownProps.light_id
    })
  }
}

const Chart = connect(mapStateToProps, null)(chart)
export default Chart
