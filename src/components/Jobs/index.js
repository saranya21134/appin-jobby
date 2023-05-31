import {Component} from 'react'
import Cookies from 'js-cookie'
import {AiOutlineSearch} from 'react-icons/ai'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import JobsItem from '../JobsItem'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusProfileConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const apiStatusJobConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileData: [],
    jobData: [],
    checkBoxInput: [],
    searchInput: '',
    radioInput: '',
    apiStatusProfile: apiStatusProfileConstants.initial,
    apiStatusJob: apiStatusJobConstants.initial,
  }

  componentDidMount = () => {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({
      apiStatusProfile: apiStatusProfileConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const apiUrlProfile = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileResponse = await fetch(apiUrlProfile, options)

    if (profileResponse.ok === true) {
      const fetchedData = [await profileResponse.json()]
      const updatedProfileData = fetchedData.map(eachProfile => ({
        name: eachProfile.profile_details.name,
        profileImageUrl: eachProfile.profile_details.profile_image_url,
        shortBio: eachProfile.profile_details.short_bio,
      }))
      this.setState({
        profileData: updatedProfileData,
        responseSuccess: true,
        apiStatusProfile: apiStatusProfileConstants.success,
      })
    } else {
      this.setState({
        apiStatusProfile: apiStatusProfileConstants.failure,
      })
    }
  }

  getJobDetails = async () => {
    this.setState({
      apiStatusJob: apiStatusJobConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')
    const {checkBoxInput, searchInput, radioInput} = this.state
    const jobApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkBoxInput}&minimum_package=${radioInput}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobApiUrl, options)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedJobData = fetchedData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobData: updatedJobData,

        apiStatusJob: apiStatusJobConstants.success,
      })
    } else {
      this.setState({
        apiStatusJob: apiStatusJobConstants.failure,
      })
    }
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onChangeSalaryCheckbox = event => {
    this.setState({radioInput: event.target.id}, this.getJobDetails)
  }

  onChangeInputCheckbox = event => {
    const {checkBoxInput} = this.state
    const inputNotInList = checkBoxInput.filter(
      eachItem => eachItem === event.target.id,
    )

    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkBoxInput: [...prevState.checkBoxInput, event.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filteredData = checkBoxInput.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        prevState => ({checkBoxInput: filteredData}),
        this.getJobDetails,
      )
    }
  }

  onSubmitSearchInput = () => {
    this.getJobDetails()
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  renderProfileListView = () => {
    const {profileData, responseSuccess} = this.state

    const {name, profileImageUrl, shortBio} = profileData[0]
    if (responseSuccess) {
      return (
        <div className="profile-view-container">
          <img src={profileImageUrl} className="profile-image" alt="profile" />
          <h1 className="rahul-name">{name}</h1>
          <p className="shortbio">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  onRetryProfile = () => {
    this.getProfileDetails()
  }

  renderProfileFailureView = () => (
    <div className="retry-button-container">
      <button
        type="button"
        className="retry-button"
        onClick={this.onRetryProfile}
      >
        retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRenderProfileStatus = () => {
    const {apiStatusProfile} = this.state

    switch (apiStatusProfile) {
      case apiStatusProfileConstants.success:
        return this.renderProfileListView()
      case apiStatusProfileConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusProfileConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderJobListView = () => {
    const {jobData} = this.state
    const jobDataLength = jobData.length === 0
    return jobDataLength ? (
      <div className="Something-Went-Wrong">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png  "
          className="failure-image"
          alt="no jobs"
        />
        <h1 className="went-wrong">No Jobs Found</h1>
        <p className="wrong-text">
          We could not find any jobs. Try other filters
        </p>
      </div>
    ) : (
      <ul className="job-item-container">
        {jobData.map(eachJobItem => (
          <JobsItem key={eachJobItem.id} jobItemDetails={eachJobItem} />
        ))}
      </ul>
    )
  }

  onRetryJob = () => {
    this.getJobDetails()
  }

  renderJobFailureView = () => (
    <div className="Something-Went-Wrong">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="failure-image"
        alt="failure view"
      />
      <h1 className="went-wrong">Oops! Something Went Wrong</h1>
      <p className="wrong-text">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-button" onClick={this.onRetryJob}>
        Retry
      </button>
    </div>
  )

  onRenderJobStatus = () => {
    const {apiStatusJob} = this.state

    switch (apiStatusJob) {
      case apiStatusJobConstants.success:
        return this.renderJobListView()
      case apiStatusJobConstants.failure:
        return this.renderJobFailureView()
      case apiStatusJobConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onGetCheckboxView = () => (
    <ul className="list-container">
      {employmentTypesList.map(eachUser => (
        <li className="list-item" key={eachUser.employmentTypeId}>
          <input
            className="input"
            type="checkbox"
            id={eachUser.employmentTypeId}
            onClick={this.onChangeInputCheckbox}
          />
          <label className="label" htmlFor={eachUser.employmentTypeId}>
            {eachUser.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetRadioView = () => (
    <ul className="list-container">
      {salaryRangesList.map(eachList => (
        <li className="list-item" key={eachList.salaryRangeId}>
          <input
            className="input"
            type="radio"
            id={eachList.salaryRangeId}
            name="option"
            onClick={this.onChangeSalaryCheckbox}
          />
          <label className="label" htmlFor={eachList.salaryRangeId}>
            {eachList.label}
          </label>
        </li>
      ))}
    </ul>
  )

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="bg-container-job">
          <div className="job-catogry-container">
            {this.onRenderProfileStatus()}
            <hr className="horizontal" />
            <h1 className="heading-select">Type of Employment</h1>
            {this.onGetCheckboxView()}
            <hr className="horizontal" />
            <h1 className="heading-select">Salary Range</h1>
            {this.onGetRadioView()}
          </div>
          <div className="input-job-container">
            <div className="input-search-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                data-testid="searchButton"
                type="button"
                className="search-button"
                onClick={this.onSubmitSearchInput}
              >
                <AiOutlineSearch className="search-icon" />
              </button>
            </div>
            {this.onRenderJobStatus()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
