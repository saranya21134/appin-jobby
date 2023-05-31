import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const SimilarJob = props => {
  const {similarJobItemDetails} = props
  const {
    companyLogoUrl,
    employmentType,

    jobDescription,
    location,
    rating,
    title,
  } = similarJobItemDetails

  return (
    <li className="list-item-similar-job">
      <div className="company-name-logo">
        <img src={companyLogoUrl} className="company-logo" alt="company logo" />
        <div className="title-rating-container">
          <h1 className="employment-heading">{title}</h1>
          <AiFillStar className="star" />
          <span className="rating">{rating}</span>
        </div>
      </div>
      <h1 className="des-heading">Description</h1>
      <p className="job-description">{jobDescription}</p>

      <div className="location-employment-container">
        <MdLocationOn className="location-logo" />
        <span className="location">{location}</span>

        <span className="employment-type">{employmentType}</span>
      </div>
    </li>
  )
}
export default SimilarJob
