const Load = ({progressClass,loadClass}) => {
  return (
    <div className={`flex items-center w-full justify-center ${loadClass}`}>
<div class="spinner !w-9">
    <svg viewBox="25 25 50 50" class="circular">
        <circle stroke-miterlimit="10" stroke-width="3" fill="none" r="20" cy="50" cx="50" class="path"></circle>
    </svg>
</div>
    </div>
  );
};
export default Load;
