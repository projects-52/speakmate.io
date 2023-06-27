import type { ActionFunction } from 'react-router';

export const action: ActionFunction = async ({ request }) => {
  const data = await request.json();
  console.log(data);

  return new Response(JSON.stringify(data));
};
