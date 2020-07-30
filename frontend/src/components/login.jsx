import React, { useState } from 'react'
import { login } from '../utils/auth'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async e => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);
    try {
      const response = await fetch(`/api/v1/login`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
        credentials: 'include',
      })
      const res = await response.json()
      const { access_token, user } = res

      if (res === 404) {
        throw Error('Unable to log in, please check your credentials.')
      }

      if (res === 500) {
        throw Error('Sorry, something went wrong. Please try again.')
      }

      window.user = user
      setSubmitting(false);
      login(access_token, user.id.toString())
    } catch (err) {
      setSubmitting(false);
      setErrorMessage(err.message)
      console.error(err.message)
    }
  }

  return (
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <div class="max-w-md w-full px-6">
        <img class="mx-auto h-9 w-auto mb-6" src="thirdave.png" alt=""></img>
        <p class="text-md leading-5 font-bold text-center text-gray-700 font-small py-2">
          Log in to your account
        </p>
        <form onSubmit={onSubmit} class="mt-4">
          <div class="rounded-md shadow-sm">
            <div>
              <input
                class="relative shadow appearance-none border border-gray-300 focus:outline-none focus:placeholder-gray-600 placeholder-gray-500 text-gray-700 rounded-t-md w-full px-3 py-2 leading-tight sm:text-md"
                id="username"
                type="text"
                placeholder="Username"
                aria-label="Username"
                onChange={e => {
                  setUsername(e.target.value)
                }}
                required
              />
            </div>
            <div class="-mt-px flex">
              <input
                class="relative shadow appearance-none border border-gray-300 focus:outline-none focus:placeholder-gray-600 placeholder-gray-500 text-gray-700 rounded-b-md w-full px-3 py-2 leading-tight sm:text-md"
                id="password"
                type="password"
                placeholder="Password"
                onChange={e => {
                  setPassword(e.target.value)
                }}
                required
              />
            </div>
          </div>
          <div class="mt-4">
            <button
              class="relative block w-full py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-800 hover:bg-gray-700"
              type="submit"
            >
              {submitting ? 'Signing In...' : 'Sign In'}
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
                Don't have an account?
              </span>
            </div>
          </div>
          <div class="mt-6">
            <a
              href="/register"
              class="hover:no-underline block w-full text-center text-sm leading-5 py-2 px-3 border-2 border-gray-500 hover:border-gray-700 hover:text-gray-900 rounded-md text-gray-900 font-medium focus:outline-none focus:border-gray-400"
            >
              Register for an account
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
