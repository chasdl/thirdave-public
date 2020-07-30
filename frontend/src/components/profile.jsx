import React, { Component } from "react";
import { withAuthSync } from "../utils/auth";
import cookie from 'js-cookie';
import '../../src/loader.css'

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: window && window.user ? window.user.email : '',
      name: window && window.user ? window.user.name : '',
      optIn: window && window.user ? window.user.wants_emails : false,
      isError: false,
      isSuccess: false,
      isLoading: false
    }
  }

  async componentDidMount() {
    try {
      const response = await this.fetchUser();
      const user = response;

      this.setState({
        optIn: user.wants_emails,
        name: user.name,
        email: user.email,
        isLoading: false
      });
    } catch (e) {
      this.setState({
        isLoading: false
      });
      console.error(e);
    }
  }

  fetchUser = async () => {
    const token = cookie.get('prayer_token');
    const response = await fetch(`/api/v1/users`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      credentials: 'include',
    });
    const data = await response.json();

    if (data === 401) {
      throw Error('Sorry, something went wrong. Please try re-logging in again.');
    }

    return data;
  }

  updateUser = async (optIn, name, email) => {
    const token = cookie.get('prayer_token');
    const response = await fetch(`/api/v1/users`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        optIn,
        name,
        email
      }),
      credentials: 'include',
    });
    return await response.json();
  }

  onSubmit = async (optIn, name, email) => {
    this.setState({
      isSuccess: false,
      isError: false,
      isLoading: true
    });

    try {
      const response = await this.updateUser(optIn, name, email);

      const { user } = response;
      window.user = user;
      this.setState({
        optIn: user.wants_emails,
        name: user.name,
        email: user.email,
        isLoading: false,
        isSuccess: true
      });
    } catch (e) {
      console.error(e);
      this.setState({
        isError: true
      });
    }
    this.setState({
      isLoading: false
    });
  }

  optInChange = () =>
    this.setState((state: State) => ({
      optIn: !state.optIn,
    }));

  render() {
    return (
      <div class="min-h-screen flex items-center justify-center bg-gray-100">
      {this.state.isLoading ? (
        <div className="loading"></div>
      ) : (
        <div class="max-w-md w-full px-6">
        <div class="max-w-sm rounded overflow-hidden shadow-lg">
        <p class="text-lg leading-5 text-center text-gray-900 mt-5 mb-5">
          Email Preferences
        </p>
      <form onSubmit={() => this.onSubmit(this.state.optIn, this.state.name, this.state.email)} class="w-full max-w-sm">
  <div class="flex items-center mb-6 mr-3">
    <div class="w-1/3">
      <label class="block text-gray-500 font-bold text-right mb-1 pr-3" for="inline-name">
        Name
      </label>
    </div>
    <div class="md:w-1/2">
    <input
      class="bg-gray-100 appearance-none border-2 border-gray-300 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
      type="text"
      value={this.state.name}
      onChange={e => this.setState({ name: e.target.value })}
    >
    </input>
    </div>
  </div>
  <div class="flex items-center mb-6 mr-3">
    <div class="w-1/3">
      <label class="block text-gray-500 font-bold text-right mb-1 pr-3" for="inline-email">
      Email
      </label>
      </div>
      <div class="md:w-1/2">
        <input
        class="bg-gray-100 appearance-none border-2 border-gray-300 rounded w-full py-1 px-1 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        type="email"
        value={this.state.email}
        onChange={e => this.setState({ email: e.target.value })}
      >
    </input>
    </div>
  </div>
  <div class="py-2 px-4 flex items-center mb-6">
    <label class="block text-gray-500 font-bold">
      <input class="mr-2 leading-tight" type="checkbox" checked={this.state.optIn} onClick={() => this.optInChange()}></input>
      <span class="text-sm">
        I would like to receive daily email reminders to pray for a 3ABC Member.
      </span>
    </label>
  </div>
  <div class="mt-4 mb-3 px-3">
      <button class="relative block w-full py-2 px-3 border border-transparent rounded-md text-white font-semibold bg-gray-800 hover:bg-gray-700" type="submit">
        Update
      </button>
  </div>
  </form>
  {this.state.isError && (
                  <div class="mt-4 mb-3 px-3">
                  <div class="bg-red-100 border border-red-400 text-red-700 px-5 py-2 rounded relative" role="alert">
                  <strong class="font-bold">Oops</strong>
                  <span class="block sm:inline"> Something went wrong.</span>
                </div>
                </div>
              )}
            {this.state.isSuccess && (
              <div class="mt-4 mb-3 px-3">
                <div class="bg-green-100 border border-green-400 text-green-700 px-3 py-2 rounded relative" role="alert">
                <strong class="font-bold">Success</strong>
                <span class="block sm:inline"> Profile updated</span>
              </div>
              </div>
              )}
  </div>
  </div>
      )}
      </div>
    );
  }
}

export default withAuthSync(Profile);