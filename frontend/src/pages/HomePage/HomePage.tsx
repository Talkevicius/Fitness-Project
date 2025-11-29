import styles from './HomePage.module.css';

const HomePage = () => {
    return (
        <div className={styles.homepageContainer}>
            <div className={styles.homepageCard}>
                <h1>This is home page Of project fitnes</h1>
                <hr></hr>
                <p>Project fitness - is university project, whoose goal is to use specifically created fitness-API,<br></br>
                    that uses RESTful calls to fetch data from database securely. This is a purely educational website/API <br></br>
                    used only for learning more about web development
                </p>
            </div>
        </div>
    );
}

export default HomePage;