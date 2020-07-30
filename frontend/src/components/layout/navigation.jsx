import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import cookie from 'js-cookie'
import { logout } from '../../utils/auth'
import { Dropdown } from './dropdown'

export class Navigation extends Component {
  constructor(props) {
    super(props)

    this.toggle = this.toggle.bind(this)
    this.state = {
      isOpen: false,
    }
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    })
  }
  onLogoutClick = () => logout()
  render() {
    const token = cookie.get('prayer_token')
    return (
      <header class="bg-gray-800 sm:flex sm:justify-between sm:items-center sm:px-4 sm:py-3">
      <div class="flex items-center justify-between px-4 py-3 sm:p-0">
        <div class="text-white font-semibold">
          <Link to="/pray" class="text-white hover:no-underline focus:no-underline"> 3ABC Prayer Reminders</Link>
        </div>
        <div class="sm:hidden">
          <button onClick={this.toggle} type="button" class="block text-gray-500 hover:text-white focus:text-white focus:outline-none">
            <svg class="h-6 w-6 fill-current" viewBox="0 0 24 24">
              {this.state.isOpen 
              ? <path fill-rule="evenodd" d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"/>
              : <path fill-rule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"/>
              }
            </svg>
          </button>
        </div>
      </div>
        {token ? (
          <>
            <nav class={this.state.isOpen ? 'sm:block block' : 'sm:block hidden'}>
              <div class="px-2 sm:flex sm:p-0">
                <Dropdown class="relative"/>
                <Link onClick={this.toggle} to="/profile" class="mt-1 block px-2 py-1 text-white font-semibold rounded hover:bg-gray-700 no-underline hover:no-underline sm:mt-0 sm:ml-2">Email Settings</Link>
                <Link onClick={this.onLogoutClick} class="mt-1 block px-2 py-1 text-white font-semibold rounded hover:bg-gray-700 hover:no-underline sm:mt-0 sm:ml-2">Log Out</Link>
              </div>
            <div class="px-4 py-4 border-t border-gray-800 sm:hidden">
              <div class="flex items-center">
                  <span class="ml-3 font-semibold text-white">Pray</span>
              </div>
            <div class="mt-4">
              <Link onClick={this.toggle} to="/pray" class="block text-gray-400 hover:text-white hover:no-underline">Members</Link>
              <Link onClick={this.toggle} to="/partners" class="mt-2 block text-gray-400 hover:text-white hover:no-underline">3ABC Partners</Link>
            </div>
            </div>
          </nav>
          </>
        ) : (
          <nav class={this.state.isOpen ? 'sm:block block' : 'sm:block hidden'}>
          <div class="px-2 pt-2 pb-4 sm:flex sm:p-0">
            <Link onClick={this.toggle} to="/login" class="mt-1 block px-2 py-1 text-white font-semibold rounded hover:bg-gray-800 sm:mt-0 sm:ml-2">Login</Link>
            <Link onClick={this.toggle} to="/register" class="mt-1 block px-2 py-1 text-white font-semibold rounded hover:bg-gray-800 sm:mt-0 sm:ml-2">Register</Link>
          </div>
        </nav>
        )}
    </header>
    )
  }
}
