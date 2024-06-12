import Draw from "./Draw";

const isMobile = (/Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i).test(navigator.userAgent);

function Home() {
  if (isMobile) return <Draw />;

  return (
    <ul>
      <li>
        <a href='/draw'>Draw</a>
      </li>
      <li>
        <a href='/control'>Control</a>
      </li>
      <li>
        <a href='/watch'>Watch</a>
      </li>
    </ul>
  );
}

export default Home;
