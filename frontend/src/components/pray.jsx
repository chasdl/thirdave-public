import React from 'react'
import { withAuthSync } from '../utils/auth'
import cookie from 'js-cookie'
import '../../src/loader.css'
class Pray extends React.Component<{}, State> {
  constructor(props) {
    super(props)

    this.state = {
      member: [],
      errorMessage: '',
      isSuccess: false,
      isLoading: true,
      lastMember: false,
    }
  }

  async componentDidMount() {
    try {
      const res = await this.fetchMember()
      if (res === 401) {
        throw Error('Please try logging in again.')
      }

      if (res === 400 || res === 404) {
        throw Error(
          'Something went wrong while logging in to CCB to fetch members'
        )
      }

      if (res === 500) {
        throw Error('Sorry, something went wrong. Please try again.')
      }

      if (res === 201) {
        this.setState({
          isLoading: false,
          lastMember: true
        })
      }

      this.setState({
        isLoading: false,
        member: res,
      })
    } catch (e) {
      this.setState({
        isLoading: false,
        errorMessage: e.message,
      })
      console.error(e)
    }
  }

  async fetchNextMember() {
    try {
      this.setState({
        isLoading: true,
        isSuccess: false,
      })
      
      const res = await this.fetchMember()

      if (res === 401) {
        throw Error('Please try logging in again.')
      }

      if (res === 400 || res === 404) {
        throw Error(
          'Something went wrong while logging in to CCB to fetch partners'
        )
      }

      if (res === 500) {
        throw Error('Sorry, something went wrong. Please try again.')
      }

      if (res === 201) {
        this.setState({
          isLoading: false,
          lastPartner: true
        })
      }

      this.setState({
        member: res,
      })
    } catch (e) {
      console.error(e)
      this.setState({
        errorMessage: e.message
      })
    }
    this.setState({
      isLoading: false,
    })
  }

  fetchMember = async () => {
    const token = cookie.get('prayer_token')
    const response = await fetch(`/api/v1/members`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })

    const member = await response.json()
    return member
  }

  createPrayer = async (memberId: string) => {
    const token = cookie.get('prayer_token')
    const response = await fetch(`/api/v1/prayers`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        member_id: memberId,
      }),
      credentials: 'include',
    })
    return await response.json()
  }

  onSubmit = async (memberId: string) => {
    this.setState({
      isSuccess: false,
      errorMessage: '',
    })

    try {
      await this.createPrayer(memberId)
      this.setState({
        isSuccess: true,
      })
    } catch (e) {
      console.error(e)
      this.setState({
        errorMessage: e.message,
      })
    }
  }

  resetPrayers = async () => {
    const token = cookie.get('prayer_token')
    const response = await fetch(`/api/v1/prayers`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    })
    return await response.json()
  }

  resetPrayerList = async () => {
    this.setState({
      isSuccess: false,
      errorMessage: '',
      isLoading: true,
    })

    try {
      await this.resetPrayers()
      const res = await this.fetchMember()

      if (res === 401) {
        throw Error('Please try logging in again.')
      }

      if (res === 400 || res === 404) {
        throw Error(
          'Something went wrong while logging in to CCB to fetch partners'
        )
      }

      if (res === 500) {
        throw Error('Sorry, something went wrong. Please try again.')
      }

      this.setState({
        isLoading: false,
        lastMember: false,
        partner: res,
      })

    } catch (e) {
      console.error(e)
      this.setState({
        errorMessage: e.message,
        isLoading: false
      })
    }
  }

  render() {

    return (
      
      <div class="min-h-screen flex items-center justify-center bg-gray-100">
              {this.state.isLoading ? (
        <div className="loading"></div>
      ) : (
      <div class="max-w-md w-full px-6 mt-3 mb-3">
      <div class="max-w-sm rounded overflow-hidden shadow-md">
        {this.state.lastMember ? (
          <div class="items-center justify-center bg-gray-100">
            <p class="text-center text-gray-700 mb-5 mt-3 ml-1 mr-1">
            Thank you for praying for all our members!
          </p>
          <div class="md:flex md:items-center py-3 px-4">
              <button
                class="relative block w-full py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-800 hover:bg-gray-700"
                type="submit"
                onClick={() => this.resetPrayerList()}
              >
              Reset prayer list
              </button>
          </div>
          </div>
        ) : (
            <>
            <img class="w-full" src={this.state.member.image_url ? this.state.member.image_url : 'no-image-available.png'} alt=""></img>
            <div class="px-6 py-4">
              <div class="font-bold text-xl mb-2">{this.state.member.name}</div>
              <p class="text-gray-700 text-sm">
                <strong>Member Since:</strong>{' '}
                {new Date(
                  this.state.member.member_since
                ).toLocaleDateString('en-US')}
                <br />
                <strong>Email:</strong>{' '}
                <a class="no-underline hover:underline text-blue-500" href={`mailto:${this.state.member.email}`}> {this.state.member.email}</a>
              </p>
            </div>
            <div class="px-6 py-4">
              <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">Member</span>
            </div>
            <div class="md:flex md:items-center py-3 px-4">
                  {this.state.isSuccess ? (
                  <button
                    class="relative block w-full py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-800 hover:bg-gray-700"
                    type="submit"
                    onClick={() => this.fetchNextMember()}
                  >
                  Pray for another 3ABC Member
                  </button>
                  ) : (
                <button
                  class="relative block w-full py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-800 focus:outline-none hover:bg-gray-700"
                  type="submit"
                  onClick={() => this.onSubmit(this.state.member.ccbid)}
                >
                  I prayed for {this.state.member.name}
                </button>
              )}
            </div>
            {this.state.errorMessage && (
                  <div class="md:flex md:items-center justify-center mb-1">
                  <div class="bg-red-100 border border-red-400 text-red-700 px-5 py-2 rounded relative" role="alert">
                  <strong class="font-bold">Oops</strong>
                  <span class="block sm:inline"> {this.state.errorMessage}</span>
                </div>
                </div>
              )}
            {this.state.isSuccess && (
              <div class="md:flex md:items-center justify-center mb-1">
                <div class="bg-green-100 border border-green-400 text-green-700 px-5 py-2 rounded relative" role="alert">
                <strong class="font-bold">Success</strong>
                <span class="block sm:inline"> Thanks for praying!</span>
              </div>
              </div>
              )}
              </>
        )}
       </div>
      </div>
             )}
    </div>
    
    )
  }
}
export default withAuthSync(Pray)
