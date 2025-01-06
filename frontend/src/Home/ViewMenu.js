import React, { useRef, useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useMenu } from '../Providers/MenuProvider';
import './css/ViewMenu.css';

export default function MenuPage() {
  const { menu, isLoading, error, refreshMenu } = useMenu();
  const flipBookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 900, height: 1200 });
  const [isMobileView, setIsMobileView] = useState(false); // מצב תצוגת פלאפון
  const [cardHeights, setCardHeights] = useState({}); // שמירה על גובה הכרטיסים של המנות

  const dishesPerPage = 3; // מספר המנות בכל עמוד

  useEffect(() => {
    const updateDimensions = () => {
      const width = Math.min(900, window.innerWidth - 40);
      const height = Math.min(1200, window.innerHeight - 80);
      setDimensions({ width, height });

      // בדיקה אם מדובר בתצוגת פלאפון
      setIsMobileView(window.innerWidth <= 768);
    };

    window.addEventListener('resize', updateDimensions);
    updateDimensions();

    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    // חישוב גובה הדינמי אחרי טענת התוכן
    const updateCardHeights = () => {
      const newCardHeights = {};
      const elements = document.querySelectorAll('.menu-page__dish-card');

      elements.forEach((element, index) => {
        newCardHeights[index] = element.offsetHeight; // קביעת גובה כל כרטיס
      });

      setCardHeights(newCardHeights); // עדכון עם הגבהים החדשים
    };

    if (menu.length > 0) {
      updateCardHeights(); // עדכון גובה הכרטיסים אחרי טעינת התפריט
    }
  }, [menu]); // עדכון כל פעם שהתפריט משתנה

  if (isLoading) return <div className="menu-page__loading">טוען תפריט...</div>;

  if (error) {
    return (
      <div className="menu-page__error-container">
        <p>שגיאה בטעינת התפריט: {error.toString()}</p>
        <button onClick={refreshMenu} className="menu-page__refresh-button">נסה שוב</button>
      </div>
    );
  }

  if (!menu || menu.length === 0) {
    return (
      <div className="menu-page__empty-menu">
        <p>אין פריטים בתפריט</p>
        <button onClick={refreshMenu} className="menu-page__refresh-button">רענן תפריט</button>
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
  Object.keys(categorizedMenu).forEach((category) => {
    const dishes = categorizedMenu[category];
    for (let i = 0; i < dishes.length; i += dishesPerPage) {
      const pageDishes = dishes.slice(i, i + dishesPerPage);
      if (i === 0) {
        pages.push({
          categoryTitle: category,
          dishes: pageDishes
        });
      } else {
        pages.push({
          categoryTitle: null,
          dishes: pageDishes
        });
      }
    }
  });

  const handlePageFlip = (e) => {
    setCurrentPage(e.data);
  };

  // תצוגת פלאפון - כרטיסיות
  if (isMobileView) {
    return (
      <div className="menu-page">
        {Object.keys(categorizedMenu).map((category) => (
          <div key={category} className="menu-page__category">
            <h2 className="menu-page__category-title">{category}</h2>
            <div className="menu-page__card-list">
              {categorizedMenu[category].map((dish, dishIndex) => (
                <div key={dishIndex} className="menu-page__dish-card" style={{ height: cardHeights[dishIndex] }}>
                  <img src={dish.image_url} alt={dish.name} className="menu-page__dish-image" />
                  <div className="menu-page__dish-details">
                    <h4 className="menu-page__dish-name">{dish.name}</h4>
                    <p className="menu-page__dish-description">{dish.description}</p>
                    <div className="menu-page__dish-footer">
                      <p className="menu-page__dish-price">{dish.price} ₪</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="menu-page">
      <HTMLFlipBook
        width={dimensions.width}
        height={dimensions.height}
        size="fixed"
        minWidth={600}
        maxWidth={900}
        minHeight={700}
        maxHeight={1200}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        onFlip={handlePageFlip}
        className="menu-page__flip-book"
        ref={flipBookRef}
      >
        <div className="menu-page__cover-page">
          <div className="menu-page__cover-content">
            <h1 className="menu-page__restaurant-name">קפה הפוך</h1>
          </div>
        </div>

        {pages.map((page, pageIndex) => (
          <div key={pageIndex} className="menu-page__page">
            {page.categoryTitle && <h2 className="menu-page__category-title">{page.categoryTitle}</h2>}
            {page.dishes.map((dish, dishIndex) => (
              <div key={dishIndex} className="menu-page__dish-container">
                <div className="menu-page__dish-item-menu">
                  <div className="menu-page__dish-image-container">
                    <img src={dish.image_url} alt={dish.name} className="menu-page__dish-image-menu" />
                  </div>
                  <div className="menu-page__dish-info-menu">
                    <h4 className="menu-page__dish-name">{dish.name}</h4>
                    <p className="menu-page__dish-description">{dish.description}</p>
                    <p className="menu-page__dish-price">{dish.price} ₪</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </HTMLFlipBook>

      <div className="menu-page__flip-navigation">
        <button
          className="menu-page__nav-button menu-page__prev-button"
          onClick={() => flipBookRef.current.pageFlip().flipPrev()}
          disabled={currentPage === 0}
        >
          <ChevronRight size={24} />
        </button>
        <button
          className="menu-page__nav-button menu-page__next-button"
          onClick={() => flipBookRef.current.pageFlip().flipNext()}
          disabled={currentPage === pages.length - 1}
        >
          <ChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
}
