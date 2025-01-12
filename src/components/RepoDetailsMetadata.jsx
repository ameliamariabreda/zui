import { Card, CardContent, Grid, Typography, Tooltip } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { DateTime } from 'luxon';
import { Markdown } from 'utilities/MarkdowntojsxWrapper';
import React from 'react';
import transform from '../utilities/transform';

const useStyles = makeStyles(() => ({
  card: {
    marginBottom: 2,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'start',
    background: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '1.5rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%'
  },
  metadataHeader: {
    color: 'rgba(0, 0, 0, 0.6)'
  },
  metadataBody: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: '150%',
    align: 'left'
  }
}));

function RepoDetailsMetadata(props) {
  const classes = useStyles();
  const { repoURL, totalDownloads, lastUpdated, size, license } = props;

  const lastDate = (lastUpdated ? DateTime.fromISO(lastUpdated) : DateTime.now().minus({ days: 1 })).toRelative({
    unit: ['weeks', 'days', 'hours', 'minutes']
  });
  return (
    <Grid container spacing={1}>
      <Grid container item xs={12}>
        <Card variant="outlined" className={classes.card}>
          <CardContent>
            <Typography variant="body2" align="left" className={classes.metadataHeader}>
              Repository
            </Typography>
            <Typography variant="body1" align="left" className={classes.metadataBody}>
              {repoURL || `not available`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid container item xs={12}>
        <Card variant="outlined" className={classes.card}>
          <CardContent>
            <Typography variant="body2" align="left" className={classes.metadataHeader}>
              Total downloads
            </Typography>
            <Typography variant="body1" align="left" className={classes.metadataBody}>
              {!isNaN(totalDownloads) ? totalDownloads : `not available`}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>
                Last publish
              </Typography>
              <Tooltip title={lastUpdated?.slice(0, 16) || ' '} placement="top">
                <Typography variant="body1" align="left" className={classes.metadataBody}>
                  {lastDate || `Timestamp N/A`}
                </Typography>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>
                Total size
              </Typography>
              <Typography variant="body1" align="left" className={classes.metadataBody}>
                {transform.formatBytes(size) || `----`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>
                License
              </Typography>
              <Tooltip title={license || ' '} placement="top">
                <Typography variant="body1" align="left" className={classes.metadataBody}>
                  {license ? <Markdown>{license}</Markdown> : `License info not available`}
                </Typography>
              </Tooltip>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {/* <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <Card variant="outlined" className={classes.card}>
            <CardContent>
              <Typography variant="body2" align="left" className={classes.metadataHeader}>Files</Typography>
              <Typography variant="body1" align="left" className={classes.metadataBody}>{filesNr || `----`}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid> */}
    </Grid>
  );
}

export default RepoDetailsMetadata;
