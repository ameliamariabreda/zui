import React, { useEffect, useMemo, useState } from 'react';

// utility
import { api, endpoints } from '../api';

// components
import Collapse from '@mui/material/Collapse';
import { Box, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { host } from '../host';
import { isEmpty } from 'lodash';
import { Link } from 'react-router-dom';
import Loading from './Loading';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import { VulnerabilityChipCheck } from 'utilities/vulnerabilityAndSignatureCheck';
import { mapCVEInfo } from 'utilities/objectModels';

const useStyles = makeStyles(() => ({
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    background: '#FFFFFF',
    boxShadow: '0rem 0.3125rem 0.625rem rgba(131, 131, 131, 0.08)',
    borderRadius: '1.875rem',
    flex: 'none',
    alignSelf: 'stretch',
    flexGrow: 0,
    order: 0,
    width: '100%',
    marginTop: '2rem',
    marginBottom: '2rem'
  },
  content: {
    textAlign: 'left',
    color: '#606060',
    padding: '2% 3% 2% 3%',
    width: '100%'
  },
  title: {
    color: '#828282',
    fontSize: '1rem',
    paddingRight: '0.5rem',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem'
  },
  values: {
    color: '#000000',
    fontSize: '1rem',
    fontWeight: '600',
    paddingBottom: '0.5rem',
    paddingTop: '0.5rem',
    textOverflow: 'ellipsis'
  },
  link: {
    color: '#52637A',
    fontSize: '1rem',
    letterSpacing: '0.009375rem',
    paddingRight: '1rem',
    textDecorationLine: 'underline'
  },
  monitor: {
    width: '27.25rem',
    height: '24.625rem',
    paddingTop: '2rem'
  },
  none: {
    color: '#52637A',
    fontSize: '1.4rem',
    fontWeight: '600'
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dropdownText: {
    color: '#1479FF',
    paddingTop: '1rem',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'center'
  }
}));

function VulnerabilitiyCard(props) {
  const classes = useStyles();
  const { cve, name } = props;
  const [openDesc, setOpenDesc] = useState(false);
  const [openFixed, setOpenFixed] = useState(false);
  const [loadingFixed, setLoadingFixed] = useState(true);
  const [fixedInfo, setFixedInfo] = useState([]);

  useEffect(() => {
    if (!openFixed || !isEmpty(fixedInfo)) {
      return;
    }
    setLoadingFixed(true);
    api
      .get(`${host()}${endpoints.imageListWithCVEFixed(cve.id, name)}`)
      .then((response) => {
        if (response.data && response.data.data) {
          const fixedTagsList = response.data.data.ImageListWithCVEFixed?.map((e) => e.Tag);
          setFixedInfo(fixedTagsList);
        }
        setLoadingFixed(false);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [openFixed]);

  const renderFixedVer = () => {
    if (!isEmpty(fixedInfo)) {
      return fixedInfo.map((tag, index) => {
        return (
          <Link key={index} to={`/image/${encodeURIComponent(name)}/tag/${tag}`} className={classes.link}>
            {tag}
          </Link>
        );
      });
    } else {
      return 'Not fixed';
    }
  };

  return (
    <Card className={classes.card} raised>
      <CardContent className={classes.content}>
        <Stack sx={{ flexDirection: 'row' }}>
          <Typography variant="body1" align="left" className={classes.values}>
            {' '}
            {cve.id}
          </Typography>
        </Stack>
        <VulnerabilityChipCheck vulnerabilitySeverity={cve.severity} />
        <Stack sx={{ flexDirection: 'row' }}>
          <Typography variant="body1" align="left" className={classes.values}>
            {' '}
            {cve.title}
          </Typography>
        </Stack>
        <Stack className={classes.dropdown} onClick={() => setOpenFixed(!openFixed)}>
          {!openFixed ? (
            <KeyboardArrowRight className={classes.dropdownText} />
          ) : (
            <KeyboardArrowDown className={classes.dropdownText} />
          )}
          <Typography className={classes.dropdownText}>Fixed in</Typography>
        </Stack>
        <Collapse in={openFixed} timeout="auto" unmountOnExit>
          <Box>
            <Typography variant="body2" align="left" sx={{ color: '#0F2139', fontSize: '1rem', width: '100%' }}>
              {' '}
              {loadingFixed ? 'Loading...' : renderFixedVer()}{' '}
            </Typography>
          </Box>
        </Collapse>
        <Stack className={classes.dropdown} onClick={() => setOpenDesc(!openDesc)}>
          {!openDesc ? (
            <KeyboardArrowRight className={classes.dropdownText} />
          ) : (
            <KeyboardArrowDown className={classes.dropdownText} />
          )}
          <Typography className={classes.dropdownText}>Description</Typography>
        </Stack>
        <Collapse in={openDesc} timeout="auto" unmountOnExit>
          <Box>
            <Typography variant="body2" align="left" sx={{ color: '#0F2139', fontSize: '1rem' }}>
              {' '}
              {cve.description}{' '}
            </Typography>
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  );
}

function VulnerabilitiesDetails(props) {
  const classes = useStyles();
  const [cveData, setCveData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const abortController = useMemo(() => new AbortController(), []);
  const { name, tag } = props;

  useEffect(() => {
    setIsLoading(true);
    api
      .get(`${host()}${endpoints.vulnerabilitiesForRepo(`${name}:${tag}`)}`, abortController.signal)
      .then((response) => {
        if (response.data && response.data.data) {
          let cveInfo = response.data.data.CVEListForImage;
          let cveListData = mapCVEInfo(cveInfo);
          setCveData(cveListData);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setIsLoading(false);
        setCveData({});
      });
    return () => {
      abortController.abort();
    };
  }, []);

  const renderCVEs = (cves) => {
    if (cves?.length !== 0) {
      return (
        cves &&
        cves.map((cve, index) => {
          return <VulnerabilitiyCard key={index} cve={cve} name={name} />;
        })
      );
    } else {
      return (
        <div>
          <Typography className={classes.none}> No Vulnerabilities </Typography>{' '}
        </div>
      );
    }
  };

  return (
    <>
      <Typography
        variant="h4"
        gutterBottom
        component="div"
        align="left"
        style={{
          color: 'rgba(0, 0, 0, 0.87)',
          fontSize: '1.5rem',
          fontWeight: '600',
          paddingTop: '0.5rem'
        }}
      >
        Vulnerabilities
      </Typography>
      <Divider
        variant="fullWidth"
        sx={{
          margin: '5% 0% 5% 0%',
          background: 'rgba(0, 0, 0, 0.38)',
          height: '0.00625rem',
          width: '100%'
        }}
      />
      {isLoading ? <Loading /> : renderCVEs(cveData?.cveList)}
    </>
  );
}

export default VulnerabilitiesDetails;
