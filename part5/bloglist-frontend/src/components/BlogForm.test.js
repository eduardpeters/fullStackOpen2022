import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
    const addBlog = jest.fn()
    const user = userEvent.setup()

    render(<BlogForm addBlog={addBlog} />)

    const inputTitle = screen.getByPlaceholderText('write title here')
    const inputAuthor = screen.getByPlaceholderText('write author here')
    const inputUrl = screen.getByPlaceholderText('write url here')
    const sendButton = screen.getByText('create')

    await user.type(inputTitle, 'testing a form...' )
    await user.type(inputAuthor, 'Tester' )
    await user.type(inputUrl, 'test.io' )
    await user.click(sendButton)

    expect(addBlog.mock.calls).toHaveLength(1)
    expect(addBlog.mock.calls[0][0].title).toBe('testing a form...' )
    expect(addBlog.mock.calls[0][0].author).toBe('Tester' )
    expect(addBlog.mock.calls[0][0].url).toBe('test.io' )
})