import { PostForm } from '@/components/blog/post-form';

export const metadata = {
  title: 'New Post',
};

export default function NewPostPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">New Post</h1>
      <PostForm />
    </div>
  );
}
