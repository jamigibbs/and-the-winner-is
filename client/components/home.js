import React, {Component} from 'react'
import { connect } from 'react-redux'
import { getFrameworksInfo } from '../store/github-frameworks'

class Home extends Component {
  componentDidMount(){
    this.props.fetchFrameworksInfo()
  }

  render() {
    const { frameworksInfo } = this.props
    return (
      <div>
        <p>Frameworks List</p>
        <ul>
        { frameworksInfo &&
          frameworksInfo.map((framework) => {
            return <li key={framework.id}>{framework.fullName}</li>
          })
        }
        </ul>
      </div>
    )
  }
}

const MapStateToProps = (state) => {
  return {
    frameworksInfo: state.githubFrameworks.frameworksDevInfo
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchFrameworksInfo: () => {
      dispatch(getFrameworksInfo())
    }
  }
}

export default connect(MapStateToProps, mapDispatchToProps)(Home)
