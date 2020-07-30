import React from 'react'
import { Link } from 'react-router-dom'
import cookie from 'js-cookie'

const Home = () => {
  const token = cookie.get('prayer_token')
  return (
    <div class="mt-6 flex items-center justify-center bg-gray-100">
      <div class="mt-6 max-w-md w-full px-2">
        <img class="mx-auto h-9 w-auto mb-6" src="thirdave.png" alt=""></img>
        <p class="font-serif text-lg leading-5 text-center text-gray-700 font-large">
        </p>
        {token ? (
          <div class="mt-6 flex items-center justify-center" >
            <div class="mt-4">
              <Link to="/pray" class="block px-2 py-4 text-gray-700 font-semibold rounded hover:bg-gray-200 ml-3">Pray for 3ABC Members</Link>
              <Link to="/partners" class="block px-2 py-4 text-gray-700 font-semibold rounded hover:bg-gray-200 ml-4">Pray for 3ABC Partners</Link>
            </div>
          </div>
        ) : (
          <div class="mt-6 flex items-center justify-center">
            <Link to="/login" class="block px-2 py-4 text-gray-700 font-semibold rounded hover:bg-gray-200 ml-3">Login</Link>
            <Link to="/register" class="block px-2 py-4 text-gray-700 font-semibold rounded hover:bg-gray-200 ml-4">Register</Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
