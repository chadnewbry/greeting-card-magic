import sanityClient from '@sanity/client';

export default sanityClient({
  projectId: 'nyralf7b',
  dataset: 'production',
  useCdn: true,
});