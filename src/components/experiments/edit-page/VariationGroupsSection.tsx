import { Grid, GridItem, Heading } from '@chakra-ui/react';
import GroupPieChart from './GroupPieChart';
import GroupTabsView from './GroupTabsView';
import GroupsControl from './GroupsControl';
import PageSection from '#/components/helpers/PageSection';
import { useExperimentContext } from './ExperimentContext';

export default function VariationGroupsSection() {
  const { experiment } = useExperimentContext();

  return (
    <PageSection>
      <Heading size="lg">User Groups ({experiment.groups.length})</Heading>
      <Grid templateColumns="1fr 2fr" gap={6}>
        <GridItem>
          <Grid templateRows="1fr 1fr" height="fit-content">
            <GridItem>
              <GroupPieChart />
            </GridItem>
            <GridItem>
              <GroupsControl />
            </GridItem>
          </Grid>
        </GridItem>
        <GridItem>
          <GroupTabsView />
        </GridItem>
      </Grid>
    </PageSection>
  );
}
