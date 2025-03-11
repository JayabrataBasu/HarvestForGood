import ReactMarkdown from 'react-markdown';
// ...existing code...
className="w-full p-3 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
// ...existing code...
className={`mt-2 px-4 py-2 rounded-md ${
  submitting || !newComment.trim()
    ? 'bg-gray-400 cursor-not-allowed'
    : 'bg-green-600 hover:bg-green-700'
} text-white`}
// ...existing code...
<div className="mt-4 prose lg:prose-xl">
  <ReactMarkdown>{post.content}</ReactMarkdown>
</div>
// ...existing code...
