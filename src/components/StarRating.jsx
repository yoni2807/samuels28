export default function StarRating({ rating, onRate, readonly = false }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(star => (
        <span
          key={star}
          className={`star ${star <= rating ? 'filled' : ''}`}
          onClick={() => !readonly && onRate && onRate(star === rating ? 0 : star)}
          style={{ cursor: readonly ? 'default' : 'pointer' }}
        >
          ★
        </span>
      ))}
    </div>
  );
}