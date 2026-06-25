const Card = ({ children, className = '', onClick }) => {
  return (
    <div 
      className={`card ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
