import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {BiLinkExternal} from 'react-icons/bi'
import {MdLocationOn} from 'react-icons/md'
import SimilarJob from '../SimilarJob'
import Header from '../Header'
import './index.css'

const apiStatusJobItemConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class JobsItemsDetails extends Component {
  state = {
    jobItemData: [],
    similarJobItem: [],
    apiStatusJobItem: apiStatusJobItemConstants.initial,
  }

  componentDidMount = () => {
    this.getJobItemDetails()
  }

  getJobItemDetails = async props => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({
      apiStatusJobItem: apiStatusJobItemConstants.inProgress,
    })

    const jwtToken = Cookies.get('jwt_token')

    const jobApiUrl = `https://apis.ccbp.in/blogs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const responseJob = await fetch(jobApiUrl, options)

    if (responseJob.ok === true) {
      const fetchedJobData = await responseJob.json()

      const updatedJobItemData = [fetchedJobData.job_details].map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        companyWebsiteUrl: eachJob.company_website_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        lifeAtCompony: {
          description: eachJob.life_at_compony.description,
          imageUrl: eachJob.life_at_compony.image_url,
        },
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        skills: eachJob.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        title: eachJob.title,
      }))

      const updatedSimilarJobItemData = fetchedJobData.similar_jobs.map(
        eachJob => ({
          companyLogoUrl: eachJob.company_logo_url,
          employmentType: eachJob.employment_type,
          id: eachJob.id,
          jobDescription: eachJob.job_description,
          location: eachJob.location,
          rating: eachJob.rating,
          title: eachJob.title,
        }),
      )

      this.setState({
        jobItemData: updatedJobItemData,
        similarJobItem: updatedSimilarJobItemData,
        apiStatusJobItem: apiStatusJobItemConstants.success,
      })
    } else {
      this.setState({
        apiStatusJobItem: apiStatusJobItemConstants.failure,
      })
    }
  }

  onRetryJobItem = () => {
    this.getJobItemDetails()
  }

  renderJobItemFailureView = () => (
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
      <button
        type="button"
        className="retry-button"
        onClick={this.onRetryJobItem}
      >
        Retry
      </button>
    </div>
  )

  renderJobItemSuccessView = () => {
    const {jobItemData, similarJobItem} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
      skills,
      lifeAtCompony,
      id,
    } = jobItemData[0]

    if (jobItemData.length >= 1) {
      return (
        <>
          <div className="bg-container-job-item">
            <div className="company-name-logo">
              <img
                src={companyLogoUrl}
                className="company-logo"
                alt="company logo"
              />
              <div className="title-rating-container">
                <h1 className="employment-heading">{title}</h1>
                <AiFillStar className="star" />
                <span className="rating">{rating}</span>
              </div>
            </div>
            <div className="location-employment-package-container">
              <div>
                <MdLocationOn className="location-logo" />
                <span className="location">{location}</span>

                <span className="employment-type">{employmentType}</span>
              </div>
              <div className="package-container">
                <p className="package">{packagePerAnnum}</p>
              </div>
            </div>
            <hr className="horizontal" />

            <div className="anchor-description-container">
              <h1 className="des-heading">Description</h1>
              <a href={companyWebsiteUrl}>
                visit
                <BiLinkExternal />
              </a>
            </div>
            <p className="job-description">{jobDescription}</p>
            <h1 className="skills">Skills</h1>
            <ul className="skill-unordered-item">
              {skills.map(eachSkillItem => (
                <li className="skill-list-item">
                  <img
                    className="skill-image"
                    src={eachSkillItem.imageUrl}
                    alt={eachSkillItem.name}
                  />
                  <p className="skill-name">{eachSkillItem.name}</p>
                </li>
              ))}
            </ul>
            <h1 className="skills">Life at Company</h1>
            <div>
              <p className="job-description">{lifeAtCompony.description}</p>
              <img
                className="description-image"
                src={lifeAtCompony.imageUrl}
                alt="life at company"
              />
            </div>
          </div>
          <h1 className="similar-jobs-heading">Similar Jobs</h1>
          <ul className="similarJob-item-container">
            {similarJobItem.map(eachJobItem => (
              <SimilarJob
                key={eachJobItem.id}
                similarJobItemDetails={eachJobItem}
              />
            ))}
          </ul>
        </>
      )
    }
    return null
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onRenderJobItemStatus = () => {
    const {apiStatusJobItem} = this.state

    switch (apiStatusJobItem) {
      case apiStatusJobItemConstants.success:
        return this.renderJobItemSuccessView()
      case apiStatusJobItemConstants.failure:
        return this.renderJobItemFailureView()
      case apiStatusJobItemConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />

        <div className="bg-container-job-item">
          {this.onRenderJobItemStatus()}
        </div>
      </>
    )
  }
}
export default JobsItemsDetails
