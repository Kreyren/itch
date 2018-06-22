import React from "react";
import { IRequestCreator } from "butlerd";
import { Game } from "common/butlerd/messages";
import butlerCaller from "renderer/hocs/butlerCaller";
import { LocalizedString } from "common/types";
import {
  Title,
  TitleSpacer,
  StandardGameCover,
  TitleBox,
  coverHeight,
} from "renderer/pages/PageStyles/games";
import ErrorState from "renderer/basics/ErrorState";
import LoadingCircle from "renderer/basics/LoadingCircle";
import { T } from "renderer/t";
import { isEmpty } from "underscore";
import styled, * as styles from "renderer/styles";

const StripeDiv = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  overflow: hidden;
  position: relative;

  height: ${coverHeight + 2}px;

  padding: 1.2em 0;
  margin-bottom: 32px;
`;

const ViewAll = styled.a`
  position: absolute;
  background: ${props => props.theme.breadBackground};
  box-shadow: 0 0 30px ${props => props.theme.breadBackground};
  padding: 0 4em;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  overflow: hidden;

  z-index: 4;
`;

const StripeItem = styled.div`
  ${styles.boxy()};
  flex-shrink: 0;
  margin-right: 0.8em;
`;

interface Props<Params, Res> {
  title: LocalizedString;
  href: string;
  params: Params;
  sequence?: number;
  renderTitleExtras?: () => JSX.Element;
  map: (r: Res) => Game[];
}

interface FetchRes {
  items?: any[];
}

const stripeLimit = 12;

export default <Params, Res extends FetchRes>(
  rc: IRequestCreator<Params, Res>
) => {
  const Call = butlerCaller(rc);

  return class extends React.PureComponent<Props<Params, Res>> {
    render() {
      const { params, sequence } = this.props;

      return (
        <Call
          params={{ ...(params as any), limit: stripeLimit }}
          sequence={sequence}
          loadingHandled
          errorsHandled
          render={({ result, error, loading }) => (
            <>
              {this.renderTitle(loading, error)}
              <StripeDiv>
                {this.renderViewAll()}
                {this.renderItems(result)}
                {this.renderEmpty()}
              </StripeDiv>
            </>
          )}
        />
      );
    }

    renderTitle(loading: boolean, error: any): JSX.Element {
      const { href, title, renderTitleExtras = renderNoop } = this.props;
      return (
        <>
          <TitleBox>
            <Title>
              <a href={href}>{T(title)}</a>
              {loading ? (
                <>
                  <TitleSpacer />
                  <LoadingCircle progress={-1} />
                </>
              ) : null}
              {renderTitleExtras()}
            </Title>
          </TitleBox>
          <ErrorState error={error} />
        </>
      );
    }

    renderItems(result: Res): JSX.Element {
      if (!result) {
        return null;
      }

      if (isEmpty(result.items)) {
        return null;
      }

      const doneSet = new Set<number>();
      const games = this.props.map(result);
      return (
        <>
          {games.map(game => {
            if (doneSet.has(game.id)) {
              return null;
            }
            doneSet.add(game.id);
            return (
              <StripeItem key={game.id}>
                <StandardGameCover game={game} showInfo />
              </StripeItem>
            );
          })}
        </>
      );
    }

    renderEmpty(): JSX.Element {
      return (
        <>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(id => (
            <StripeItem key={`empty-${id}`}>
              <StandardGameCover game={null} />
            </StripeItem>
          ))}
        </>
      );
    }

    renderViewAll(): JSX.Element {
      return <ViewAll href={this.props.href}>View all...</ViewAll>;
    }
  };
};

function renderNoop(): JSX.Element {
  return null;
}
