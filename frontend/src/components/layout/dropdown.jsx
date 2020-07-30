import React, { Component }  from "react";
import { Link } from 'react-router-dom'


export class Dropdown extends Component {
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
  render() {
    return (
      <div class="hidden sm:block">
        <button onClick={this.toggle} class="mt-1 px-2 py-1 focus:outline-none text-white font-semibold rounded hover:bg-gray-700 sm:mt-0 sm:ml-2">
          Pray
          <svg class="inline ml-2" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 9L12 16L5 9" stroke="#999999" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        {this.state.isOpen && (
          <>
          <button onClick={this.toggle} tabIndex="-1" class="fixed inset-0 h-full w-full bg-black opacity-50 cursor-default"></button>
          <div class="absolute right-1 mt-2 py-2 w-48 bg-white rounded-lg shadow-xl">
          <Link onClick={this.toggle} to="/pray" class="no-underline block px-4 py-2 text-gray-800 hover:bg-gray-800 hover:text-white hover:no-underline">Members</Link>
          <Link onClick={this.toggle} to="/partners" class="block px-4 py-2 text-gray-800 hover:bg-gray-800 hover:text-white hover:no-underline">3ABC Partners</Link>
        </div>
        </>
        )}
      </div>
    )
  }
}





