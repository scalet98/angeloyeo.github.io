clear; close all; clc;

%% pic1 등에 사용된 벡터장
[x,y]=meshgrid(linspace(-2, 2, 15), linspace(-2, 2, 15));
u =x.^2;
v = y;
quiver(x, y, u, v)
grid on;
title('Vector Field: $$F(x,y) = x^2\hat{i}+y\hat{j}$$','interpreter','latex')
