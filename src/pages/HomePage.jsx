// components
import React from 'react';
import Header from '../components/Header.jsx'
import Rightbar from '../components/Rightbar.jsx'

import makeStyles from '@mui/styles/makeStyles';
import {Container, Grid} from '@mui/material';


const useStyles = makeStyles((theme) => ({
    container: {
        paddingTop: 5,
        paddingBottom: 5,
        height: '100vh',
    },
    gridWrapper: {
        backgroundColor: "#fff",
        border: "1px #f2f2f2 dashed",
    },
    pageWrapper: {
      
    },
    tile: {
      width: '100%',
    }
}));

function HomePage({ data, updateData, keywords, updateKeywords }) {
  const classes = useStyles();

  return (
      <div className={classes.pageWrapper}>
        <Header updateKeywords={updateKeywords}></Header>
        <Container maxWidth="md" className={classes.container}>
            <Grid container className={classes.gridWrapper}>
                <Grid item className={classes.tile}>
                    <Rightbar keywords={keywords} data={data} updateData={updateData}/>
                </Grid>
            </Grid>
        </Container>
      </div>
  );
}

export default HomePage;