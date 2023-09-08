export const internationalizationData = {
  global: {
    platformName: 'PRMS Reporting'
  },
  home: {
    a: 'Welcome to the PRMS Reporting tool. According to your profile, you can report for the Initiative(s):',
    b: 'Welcome to the PRMS Reporting tool. As a guest user you are welcome to explore the results reported at the links below.',
    c: 'Welcome to the PRMS Reporting tool. As per your profile, you have an admin account, which provides you with full access to the tool and full editing rights.',

    alerts: {}
  },
  resultsList: {
    alerts: {
      info: 'There is a possibility that the result you want to report has already been entered into the PRMS Reporting tool. If this is the case, it is only necessary to map the result to your Initiative. There is no need to enter it as a new result. Please use the results table below to ensure that your result has not been previously entered.'
    }
  },
  reportNewResult: {
    greeting: (name: string, initiatives: string, isAdmin: boolean) => `Hello <strong>${name}</strong>, ${isAdmin ? 'as an admin user, you can report results for <strong>any initiative</strong> in the PRMS Reporting tool.' : `you can report for <strong>${initiatives}</strong>. If you would like to report for another Initiative, please contact <a class="open_route" href="mailto: projectcoordinationunit@cgiar.org">Project Coordination Unit.</a>`}`,
    alerts: {
      info: 'Remember that there is a possibility that the result you want to report has already been entered into the PRMS Reporting tool. If this is the case, it is only necessary to map the result to your Initiative. There is no need to enter it as a new result. Please check the results section to see if your result has been previously entered.'
    }
  },
  login: {
    alerts: {
      400: 'Missing information',
      401: 'Incorrect credentials',
      404: 'This user is not registered. <br> Please contact the support team.'
    }
  }
};

// platformName: string;
