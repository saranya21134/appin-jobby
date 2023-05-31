import {Link} from 'react-router-dom'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import './index.css'

const JobsItem = props => {
  const {jobItemDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
    id,
  } = jobItemDetails

  return (
    <Link className="route-link" to={`/jobs/${id}`}>
      <li className="job-list-item">
        <div className="company-name-logo">
          <img
            src={companyLogoUrl}
            className="company-logo"
            alt="company logo"
          />
          <div className="title-rating-container">
            <h1 className="employment-heading">{title}</h1>
            <div className="star-rating-container">
              <AiFillStar className="star" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-employment-package-container">
          <div className="location-employment-container">
            <div className="location-container">
              <MdLocationOn className="location-logo" />
              <p className="location">{location}</p>
            </div>
            <div>
              <p className="employment-type">{employmentType}</p>
            </div>
          </div>
          <div className="package-container">
            <p className="package">{packagePerAnnum}</p>
          </div>
        </div>
        <hr className="horizontal" />

        <div className="description">
          <h1 className="des-heading">Description</h1>
          <p className="job-description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobsItem
