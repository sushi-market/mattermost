# Mattermost Customizations

This fork tracks local changes applied on top of official Mattermost release tags.

## Fork Workflow

- Keep the official Mattermost repository as `upstream`.
- Keep local customization branches based on official release tags, for example `custom-client-11.4.2` from `v11.4.2`.
- Keep each customization as a small, focused commit so it can be moved to a newer Mattermost tag with `git cherry-pick`.
- Do not commit generated build output unless a deployment process explicitly requires it.

## Active Base

- Official base tag: `v11.4.2`
- Custom branch: `custom-client-11.4.2`

## Custom Change Log

| Date | Area | Files | Description |
| --- | --- | --- | --- |
| 2026-04-24 | Web app HTML | `webapp/channels/src/root.html` | Set the root document language to Russian with `<html lang="ru">`. |
