export default async function getSliders() {
  const result = await fetch(`http://localhost:5000/api/sliders`);

  return result.json();
}
