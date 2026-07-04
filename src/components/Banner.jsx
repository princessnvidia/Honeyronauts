import { Link } from 'react-router-dom'



const Banner = () => {
  return (
 <div className="container-banner">

    <div className='blur'></div>

    <div className="test-page">
      <div className="blur-card"></div>
    </div>

    <div className="banner">
      <Link to="/">
        <div className="col">
            
            Home
        </div>
      </Link>
      <Link to="/calendar">
        <div className="col">
            
            Calendar
        </div>
      </Link>
      <Link to="/stats">
        <div className="col">
            
            Stats
        </div>
      </Link>
      <Link to="/instructions">
        <div className="col">
            
            Instructions
        </div>
      </Link>

      
    </div>

    

    

</div>
  )
}

export default Banner