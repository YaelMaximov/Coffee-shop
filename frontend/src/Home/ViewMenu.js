import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useMenu } from '../MenuProvider';
import './MenuPage.css';

export default function MenuPage() {
  const { menu, isLoading, error, refreshMenu } = useMenu();
  const flipBookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 700, height: 900 });
  const dishesPerPage = 3; // מספר המנות בכל עמוד

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(700, window.innerWidth - 40);
      const height = Math.min(900, window.innerHeight - 80);
      setDimensions({ width, height });
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (isLoading) return <div className="loading">טוען תפריט...</div>;

  if (error) {
    return (
      <div className="error-container">
        <p>שגיאה בטעינת התפריט: {error.toString()}</p>
        <button onClick={refreshMenu} className="refresh-button">נסה שוב</button>
      </div>
    );
  }

  if (!menu || menu.length === 0) {
    return (
      <div className="empty-menu">
        <p>אין פריטים בתפריט</p>
        <button onClick={refreshMenu} className="refresh-button">רענן תפריט</button>
      </div>
    );
  }

  // חלוקה לקטגוריות
  const categorizedMenu = menu.reduce((acc, dish) => {
    if (!acc[dish.category]) {
      acc[dish.category] = [];
    }
    acc[dish.category].push(dish);
    return acc;
  }, {});

  const pages = [];

  // יצירת עמודים עם חלוקה לפי קטגוריות ומנות
  Object.keys(categorizedMenu).forEach((category) => {
    const dishes = categorizedMenu[category];

    for (let i = 0; i < dishes.length; i += dishesPerPage) {
      const pageDishes = dishes.slice(i, i + dishesPerPage);

      // הוספת כותרת הקטגוריה בעמוד הראשון שלה
      if (i === 0) {
        pages.push({
          categoryTitle: category,
          dishes: pageDishes
        });
      } else {
        pages.push({
          categoryTitle: null, // עמודים נוספים לא צריכים כותרת קטגוריה
          dishes: pageDishes
        });
      }
    }
  });

  const handlePageFlip = (e) => {
    setCurrentPage(e.data);
  };

  return (
    <div className="menu-page">
      <HTMLFlipBook
        width={dimensions.width}
        height={dimensions.height}
        size="fixed"
        minWidth={300}
        maxWidth={700}
        minHeight={600}
        maxHeight={900}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={handlePageFlip}
        className="flip-book"
        ref={flipBookRef}
      >
        <div className="page cover-page">
          <div className="cover-content">
            <h1 className="restaurant-name">קפה הפוך</h1>
          </div>
        </div>

        {pages.map((page, pageIndex) => (
          <div key={pageIndex} className="page">
            {page.categoryTitle && <h2 className="category-title">{page.categoryTitle}</h2>}
            {page.dishes.map((dish, dishIndex) => (
              <div key={dishIndex} className="dish-container">
                <div className="dish-item">
                  <div className="dish-image-container">
                    <img src={dish.image_url} alt={dish.name} className="dish-image" />
                  </div>
                  <div className="dish-info">
                    <h4 className="dish-name">{dish.name}</h4>
                    <p className="dish-description">{dish.description}</p>
                    <p className="dish-price">{dish.price} ₪</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </HTMLFlipBook>

      <div className="flip-navigation">
        <button
          className="nav-button prev-button"
          onClick={() => flipBookRef.current.pageFlip().flipPrev()}
          disabled={currentPage === 0}
        >
          <ChevronRight size={24} />
        </button>
        <button
          className="nav-button next-button"
          onClick={() => flipBookRef.current.pageFlip().flipNext()}
          disabled={currentPage === pages.length - 1}
        >
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
}
