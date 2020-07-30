import React, { useState } from 'react'
import { login } from '../utils/auth'

const Register = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [optIn, setOptIn] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const optInChange = optIn => setOptIn(!optIn)

  const onSubmit = async e => {
    e.preventDefault()
    setErrorMessage('')
    setSubmitting(true);
    try {
      const response = await fetch(`/api/v1/register`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          email: email,
          name: name,
          password: password,
          optIn: optIn,
        }),
        credentials: 'include',
      })

      const res = await response.json()

      if (res === 400) {
        throw Error('This user already exists. Please try logging in instead.')
      }

      if (res === 404) {
        throw Error(
          'Sorry, this user does not exist in CCB. Please check your CCB credentials.'
        )
      }

      if (res === 500) {
        throw Error('Sorry, something went wrong.')
      }

      const { access_token, user } = res

      window.user = user

      login(access_token, user.uuid)
      setSubmitting(false);
    } catch (err) {
      setErrorMessage(err.message)
      setSubmitting(false);
      console.error(err.message)
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="max-w-md w-full px-6 mt-4 mb-3">
        <p class="text-lg font-bold text-center text-gray-600">
          Register with CCB
        </p>
        <form onSubmit={onSubmit} class="w-full max-w-sm mt-6">
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-sm font-bold text-gray-600 md:text-right mb-1 md:mb-0 pr-4"
                for="inline-full-name"
              >
                CCB Username
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-white appearance-none border-2 border-gray-300 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="inline-full-name"
                type="text"
                required
                onChange={e => {
                  setUsername(e.target.value)
                }}
              ></input>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-sm font-bold text-gray-600 md:text-right mb-1 md:mb-0 pr-4"
                for="inline-username"
              >
                CCB Password
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-white appearance-none border-2 border-gray-300 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="inline-username"
                type="password"
                required
                onChange={e => {
                  setPassword(e.target.value)
                }}
              ></input>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-sm font-bold text-gray-600 md:text-right mb-1 md:mb-0 pr-4"
                for="inline-name"
              >
                First Name
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-white appearance-none border-2 border-gray-300 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="inline-name"
                type="text"
                onChange={e => {
                  setName(e.target.value)
                }}
              ></input>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <div class="md:w-1/3">
              <label
                class="block text-sm font-bold text-gray-600 md:text-right mb-1 md:mb-0 pr-4"
                for="inline-full-name"
              >
                Email
              </label>
            </div>
            <div class="md:w-2/3">
              <input
                class="bg-white appearance-none border-2 border-gray-300 rounded w-full py-2 px-2 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                id="inline-email"
                type="email"
                required
                onChange={e => {
                  setEmail(e.target.value)
                }}
              ></input>
            </div>
          </div>
          <div class="md:flex md:items-center mb-6">
            <label class="block text-gray-600 font-bold">
              <input
                class="mr-2 leading-tight"
                type="checkbox"
                checked={optIn}
                onClick={() => optInChange(optIn)}
              ></input>
              <span class="text-sm">
                I would like to receive daily email reminders to pray for a 3ABC
                member.
              </span>
            </label>
          </div>
          <div class="md:flex md:items-center">
            <button
              class="relative block w-full py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-800 hover:bg-gray-700"
              type="submit"
            >
              {submitting ? 'Registering...' : 'Register'}
            </button>
          </div>
          {errorMessage && (
                  <div class="md:flex md:items-center justify-center mt-3 mb-1">
                  <div class="bg-red-100 border border-red-400 text-red-700 px-5 py-2 rounded relative" role="alert">
                  <strong class="font-bold">Ope!</strong>
                  <span class="block sm:inline"> {errorMessage}</span>
                </div>
                </div>
              )}
        </form>
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm leading-5">
              <span class="px-2 bg-gray-100 text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>
          <div class="mt-6">
            <a
              href="/login"
              class="hover:no-underline block w-full text-center text-sm leading-5 py-2 px-3 border-2 border-gray-500 hover:border-gray-700 hover:text-gray-900 rounded-md text-gray-900 font-medium focus:outline-none focus:border-gray-400"
            >
              Log in
            </a>
          </div>
        </div>
        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm leading-5">
              <span class="px-2 bg-gray-100 text-gray-500">
                Forgot CCB Username or Password? Reset <a
              href="https://thirdave.ccbchurch.com/w_password.php"
              target="_blank"
              class="text-gray-800"
              rel="noopener noreferrer"
            >
              here
            </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
